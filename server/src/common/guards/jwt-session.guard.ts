import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { JwtUtil } from '../utils/jwt.util';

@Injectable()
export class JwtSessionGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let token = request.headers['authorization']?.split(' ')[1];

    if (!token && request.cookies?.accessToken) {
      token = request.cookies.accessToken;
    }
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    let payload;
    try {
      payload = await JwtUtil.verifyAccessToken(
        token,
        this.configService.get<string>('JWT_ACCESS_SECRET') as string,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const sessionId = payload.sessionId;
    const key = `session:${sessionId}`;
    const session = await this.redis.get(key);
    if (!session) {
      throw new UnauthorizedException(`Session expired`);
    }

    const parsedSession = JSON.parse(session);
    if (parsedSession.isRevoked) {
      throw new UnauthorizedException(`Session revoked`);
    }

    request.user = payload;
    return true;
  }
}
