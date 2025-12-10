import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { MailService } from 'src/infrastructure/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailDto } from './dto/verify-email.dto';
import slugify from 'slugify';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { AuthRepository } from './auth.repository';
import { JwtUtil } from 'src/common/utils/jwt.util';
import { UserRoleRepository } from '../user/repositories/user-role.repository';
import { RbacService } from '../rbac/rbac.service';
import * as jwt from 'jsonwebtoken';
import { UserSession } from 'generated/prisma';
import { UserStatus } from 'src/common/enums/user-status.enum';

@Injectable()
export class AuthService {
  private readonly TTL = parseInt(
    process.env.EMAIL_VERIFICATION_TTL_SECONDS ?? '900',
    10,
  );

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly mailService: MailService,
    private readonly rbacService: RbacService,
    private readonly userRepo: UserRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly authRepo: AuthRepository,
  ) {}

  async signup(data: SignupDto) {
    const isMatch = data.password === data.confirmPassword;
    if (!isMatch) {
      throw new BadRequestException(
        'Confirm password must be coincide with password',
      );
    }
    const existedUserByEmail = await this.userRepo.findByEmail(data.email);
    if (existedUserByEmail)
      throw new ConflictException('Email already registered!');

    const existedUserByPhone = await this.userRepo.findByPhone(data.phone);
    if (existedUserByPhone)
      throw new ConflictException('Phone already registered!');

    const saltRounds = Number(
      this.config.get<number>('BCRYPT_SALT_ROUNDS') ?? 12,
    );
    const hashedPassword = await bcrypt.hashSync(data.password, saltRounds);

    const token = CryptoUtil.randomNumber(8);
    const key = `email-verification:${token}`;
    const payload = { ...data, hashedPassword };

    await this.redis.set(key, JSON.stringify(payload), this.TTL);

    await this.mailService.sendVerificationEmail(
      data.email,
      'Verify your email to access account',
      token.toString(),
    );
  }

  async verifyAccount({ token }: VerifyEmailDto) {
    const key = `email-verification:${token}`;
    const data = await this.redis.get(key);
    if (!data)
      throw new BadRequestException('Token is invalid. Please try again later');

    const parsedData = JSON.parse(data);
    const existedUser = await this.userRepo.findByEmail(parsedData.email);
    if (existedUser) {
      await this.redis.del(key);
      throw new ConflictException('Email already existed');
    }

    const newUser = await this.userRepo.create({
      fullName: parsedData.fullName,
      email: parsedData.email,
      slug:
        slugify(parsedData.fullName, { lower: true }) +
        '-' +
        crypto.randomUUID(),
      phone: parsedData.phone,
      hashedPassword: parsedData.hashedPassword,
      address: parsedData.address,
      status: 'ACTIVE',
    });

    await this.rbacService.assignRole(newUser.id, 'user');
    await await this.redis.del(key);
    return newUser;
  }

  async signin(
    email: string,
    password: string,
    device: string,
    ipAddress: string,
  ) {
    const existedUser = await this.userRepo.findByEmail(email);
    if (!existedUser) throw new UnauthorizedException('Unauthentication!');

    const isMatch = await bcrypt.compare(password, existedUser.hashedPassword);
    if (!isMatch) throw new UnauthorizedException('Unauthentication!');

    const { publicKey, privateKey } = CryptoUtil.generateKeyPair();
    const sessionId = crypto.randomUUID();
    const payload = { userId: existedUser.id, sessionId };

    const refreshTokenExpired =
      this.config.get<string>('JWT_REFRESH_EXPIRE_IN') ?? '30d';
    const refreshToken = JwtUtil.signRefreshToken(
      payload,
      privateKey,
      refreshTokenExpired,
    );

    const session = await this.authRepo.createUserSession({
      id: sessionId,
      userId: existedUser.id,
      device,
      ipAddress,
      privateKey,
      publicKey,
      refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    const TTL = 30 * 86400;
    const payloadSession = {
      userId: existedUser.id,
      device,
      ipAddress,
      isRevoked: false,
    };
    await this.redis.set(
      `session:${sessionId}`,
      JSON.stringify(payloadSession),
      TTL,
    );
    await this.redis.clientInstance.sadd(
      `user:${existedUser.id}:sessions`,
      sessionId,
    );
    const { roleNames, perrmissionNames } =
      await this.userRoleRepo.getUserRolesPermissions(existedUser.id);

    const accessTokenSecret =
      this.config.get<string>('JWT_ACCESS_SECRET') ?? '';
    const accessTokenAlgorithm = this.config.get<string>(
      'JWT_ACCESS_ALGORITHM',
    );
    const accessTokenExpireIn = this.config.get<string>('JWT_ACCESS_EXPIRE_IN');
    const accessToken = JwtUtil.signAccessToken(
      {
        userId: existedUser.id,
        sessionId,
        roles: roleNames,
        permissions: perrmissionNames,
      },
      accessTokenSecret,
      accessTokenAlgorithm,
      accessTokenExpireIn,
    );

    await this.authRepo.updateSession(session.id, { refreshToken });
    return { accessToken, refreshToken, sessionId, user: existedUser };
  }

  async getCurrent(userId: string) {
    const existUser = await this.userRepo.findUnique({ id: userId });
    if (!existUser || existUser.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User not approved yet.');
    }

    return existUser;
  }

  async refresh(refreshToken: string) {
    const decoded: any = JwtUtil.decode(refreshToken);
    if (!decoded?.sessionId) throw new UnauthorizedException('Invalid token');

    const sessionId = decoded.sessionId;

    let publicKey = await this.redis.get(`session:${sessionId}:publicKey`);

    let session: UserSession | null = null;

    if (!publicKey) {
      session = await this.authRepo.findById(sessionId);
      if (!session) throw new UnauthorizedException('Session not found');
      if (session.isRevoked) throw new UnauthorizedException('Session revoked');

      publicKey = session.publicKey;

      const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);

      await this.redis.set(`session:${sessionId}:publicKey`, publicKey, ttl);
    }

    if (!session) {
      session = await this.authRepo.findById(sessionId);
      if (!session) throw new UnauthorizedException('Session not found');
      if (session.isRevoked) throw new UnauthorizedException('Session revoked');
    }

    try {
      JwtUtil.verifyRefreshToken(refreshToken, publicKey);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: any = JwtUtil.decode(refreshToken);

    const accessTokenSecret =
      this.config.get<string>('JWT_ACCESS_SECRET') ?? '';
    const accessTokenAlgorithm =
      this.config.get<string>('JWT_ACCESS_ALGORITHM') ?? 'HS256';
    const accessTokenExpireIn =
      this.config.get<string>('JWT_ACCESS_EXPIRE_IN') ?? '15m';

    const newAccessToken = JwtUtil.signAccessToken(
      { userId: payload.userId, sessionId },
      accessTokenSecret,
      accessTokenAlgorithm,
      accessTokenExpireIn,
    );

    const refreshTokenAlgorithm =
      this.config.get<string>('JWT_REFRESH_ALGORITHM') ?? 'RS256';
    const refreshTokenExpireIn =
      this.config.get<string>('JWT_REFRESH_EXPIRE_IN') ?? '30d';

    const newRefreshToken = JwtUtil.signRefreshToken(
      { userId: payload.userId, sessionId },
      session.privateKey,
      refreshTokenAlgorithm,
      refreshTokenExpireIn,
    );

    await this.authRepo.updateSession(sessionId, {
      refreshToken: newRefreshToken,
      updatedAt: new Date(),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(sessionId: string) {
    await this.authRepo.revokeSession(sessionId);

    await this.redis.set(
      `session:${sessionId}:revoked`,
      JSON.stringify(true),
      30 * 86400,
    );
    await this.redis.del(`session:${sessionId}`);
    await this.redis.del(`session:${sessionId}:publicKey`);
  }

  async logoutAll(userId: string) {
    const sessions = await this.redis.clientInstance.smembers(
      `user:${userId}:sessions`,
    );
    for (const sid of sessions) {
      await this.logout(sid);
    }
    await this.authRepo.revokeAll(userId);

    await this.redis.del(`user:${userId}:sessions`);
  }
}
