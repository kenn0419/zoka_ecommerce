import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UploadModule } from 'src/infrastructure/upload/upload.module';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  imports: [UploadModule],
  exports: [UserRepository, UserRoleRepository],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRoleRepository],
})
export class UserModule {}
