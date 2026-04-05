import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { RbacService } from 'src/modules/rbac/rbac.service';
import { UserRoleRepository } from 'src/modules/user/repositories/user-role.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { SignupDto } from '../dto/signup.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { SlugifyUtil } from 'src/common/utils/slugify.util';
import { UserMapper } from 'src/common/mappers/user.mapper';
import { AddressRepository } from 'src/modules/address/address.repository';
import { UserGender, UserStatus } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  private readonly EMAIL_TTL = Number(
    process.env.EMAIL_VERIFICATION_TTL_SECONDS ?? 900,
  );

  private readonly RESEND_EMAIL_TTL =
    Number(process.env.RESEND_EMAIL_VERIFICATION_TTL_SECONDS) ?? 300;

  private readonly MAX_ATTEMPTS = Number(process.env.MAX_ATTEMPTS) ?? 5;

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly rbacService: RbacService,
    private readonly mailService: MailService,
    private readonly userRepo: UserRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly addressRepo: AddressRepository,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(dto: SignupDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password confirmation mismatch');
    }

    if (await this.userRepo.findUnique({ email: dto.email })) {
      throw new ConflictException('Email already registered');
    }

    if (await this.userRepo.findUnique({ phone: dto.phone })) {
      throw new ConflictException('Phone already registered');
    }

    const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS')) ?? 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const otp = CryptoUtil.randomNumber(8).toString();
    const key = `email-verification:${dto.email}`;
    const payload = JSON.stringify({ ...dto, hashedPassword, otp });
    await this.redis.set(key, payload, this.EMAIL_TTL);

    await this.mailService.sendVerificationEmail(
      dto.email,
      'Verify your email',
      otp,
    );
  }

  async sendVerifyAccount(email: string) {
    const user = await this.userRepo.findUnique({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Account already verified');
    }

    const key = `email-verification:${email}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return;
    }

    const otp = CryptoUtil.randomNumber(8).toString();

    const payload = JSON.stringify({
      otp,
      attempts: 0,
    });

    await this.redis.set(key, payload, this.EMAIL_TTL);

    await this.mailService.sendVerificationEmail(
      email,
      'Verify your account',
      otp,
    );
  }

  async resendVerificationEmail(email: string) {
    const resendKey = `resend:email-verification:${email}`;
    const otpKey = `email-verification:${email}`;

    const cooldown = await this.redis.get(resendKey);

    if (cooldown) {
      throw new BadRequestException(
        'Please wait before requesting another OTP',
      );
    }
    const otpCached = await this.redis.get(otpKey);
    if (!otpCached) {
      return this.sendVerifyAccount(email);
    }
    const data = JSON.parse(otpCached);
    const otp = CryptoUtil.randomNumber(8).toString();

    data.otp = otp;
    data.attempts = 0;

    await this.redis.set(otpKey, JSON.stringify(data), this.EMAIL_TTL);

    await this.redis.set(
      resendKey,
      JSON.stringify(true),
      this.RESEND_EMAIL_TTL,
    );

    await this.mailService.sendVerificationEmail(
      email,
      'Verify your account',
      otp,
    );
  }

  async verifyAccount(dto: VerifyEmailDto) {
    const key = `email-verification:${dto.email}`;
    const cached = await this.redis.get(key);

    if (!cached) throw new BadRequestException('OTP expired');

    const data = JSON.parse(cached);
    if (data.attempts >= this.MAX_ATTEMPTS) {
      await this.redis.del(key);

      throw new BadRequestException('Too many attempts');
    }

    const match = data.otp === dto.token;
    if (!match) {
      data.attempts += 1;

      await this.redis.set(key, JSON.stringify(data), this.EMAIL_TTL);
      throw new BadRequestException('Invalid OTP');
    }
    const defaultAvatar = this.config.get<string>('DEFAULT_AVATAR_URL');

    const user = await this.userRepo.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      hashedPassword: data.hashedPassword,
      slug: SlugifyUtil.createSlug(data.fullName),
      birthday: data.birthday,
      gender: data.gender ?? UserGender.OTHER,
      status: UserStatus.ACTIVE,
      avatarUrl: defaultAvatar,
    });

    await this.addressRepo.createAddress(
      user.id,
      data.address,
      data.fullName,
      data.phone,
      true,
    );

    await this.rbacService.assignRole(user.id, Role.USER);
    await this.redis.del(key);

    return UserMapper.toUserResponse(user);
  }

  async signin(
    email: string,
    password: string,
    device?: string,
    ipAddress?: string,
  ) {
    const user = await this.userRepo.findUnique({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User not activated');
    }

    const session = await this.sessionService.create(
      user.id,
      device,
      ipAddress,
    );

    const { roleNames, perrmissionNames } =
      await this.userRoleRepo.getUserRolesPermissions(user.id);

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      sessionId: session.id,
      roles: roleNames,
      permissions: perrmissionNames,
    });

    const refreshToken = this.tokenService.signRefreshToken(
      { sub: user.id, sessionId: session.id },
      session.privateKey,
    );

    await this.sessionService.attachRefreshToken(session.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
      user: UserMapper.toUserResponse(user),
    };
  }

  async getCurrent(userId: string) {
    const user = await this.userRepo.findUnique({ id: userId });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User inactive');
    }
    return UserMapper.toUserResponse(user);
  }

  async refresh(refreshToken: string) {
    const payload = this.tokenService.decode(refreshToken);

    if (!payload || typeof payload === 'string') {
      throw new UnauthorizedException();
    }

    const { sub: userId, sessionId } = payload;

    const session = await this.sessionService.getSessionForRefresh(sessionId);

    this.tokenService.verifyRefreshToken(refreshToken, session.publicKey);

    const { roleNames, perrmissionNames } =
      await this.userRoleRepo.getUserRolesPermissions(userId);

    const newAccessToken = this.tokenService.signAccessToken({
      sub: userId!,
      sessionId,
      roles: roleNames,
      permissions: perrmissionNames,
    });

    const newRefreshToken = this.tokenService.signRefreshToken(
      { sub: userId!, sessionId },
      session.privateKey,
    );

    await this.sessionService.attachRefreshToken(sessionId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(sessionId: string) {
    await this.sessionService.revoke(sessionId);
  }

  async logoutAll(userId: string) {
    await this.sessionService.revokeAll(userId);
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findUnique({ email });
    if (!user) {
      return;
    }

    const token = CryptoUtil.randomNumber(8).toString();
    const key = `forgot-password:${email}`;
    const existing = await this.redis.get(key);
    if (existing && JSON.parse(existing)) {
      return;
    }
    const payload = {
      token,
      attempts: 0,
    };
    await this.redis.set(key, JSON.stringify(payload), this.EMAIL_TTL);
    await this.mailService.sendForgotPasswordEmail(
      email,
      'Forgot Password',
      token,
    );
  }

  async resendForgotPasswordOtp(email: string) {
    const resendKey = `resend:forgot-password:${email}`;
    const forgotKey = `forgot-password:${email}`;
    const cached = await this.redis.get(resendKey);
    if (cached && JSON.parse(cached)) {
      throw new BadRequestException(`Please wait before resend.`);
    }

    const otpData = await this.redis.get(forgotKey);

    if (!otpData) {
      return this.forgotPassword(email);
    }

    await this.redis.set(
      resendKey,
      JSON.stringify(true),
      this.RESEND_EMAIL_TTL,
    );

    const user = await this.userRepo.findUnique({ email });
    if (!user) {
      return;
    }
    const token = CryptoUtil.randomNumber(8).toString();

    const payload = {
      token,
      attempts: 0,
    };
    await this.redis.set(forgotKey, JSON.stringify(payload), this.EMAIL_TTL);
    await this.mailService.sendForgotPasswordEmail(
      email,
      'Forgot Password',
      token,
    );
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const key = `forgot-password:${email}`;
    const cached = await this.redis.get(key);

    if (!cached) {
      throw new BadRequestException('OTP expired.');
    }

    const data = JSON.parse(cached);
    if (data.attempts >= this.MAX_ATTEMPTS) {
      await this.redis.del(key);
      throw new BadRequestException('Too many attempts.');
    }

    const match = data.token === otp;
    if (!match) {
      data.attempts += 1;

      await this.redis.set(key, JSON.stringify(data), this.EMAIL_TTL);

      throw new BadRequestException('Invalid OTP.');
    }

    const saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS')) ?? 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const user = await this.userRepo.updateUser({ email }, { hashedPassword });
    await this.redis.del(key);

    await this.sessionService.revokeAll(user.id);
  }
}
