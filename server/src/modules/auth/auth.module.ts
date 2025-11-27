import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { AuthRepository } from './auth.repository';
import { UserModule } from '../user/user.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [PrismaModule, MailModule, RedisModule, UserModule, RbacModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
