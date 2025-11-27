import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';
import { UserRoleController } from './user-role.controller';
import { RbacRepository } from './rbac.repository';
import { RbacService } from './rbac.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RoleController, PermissionController, UserRoleController],
  providers: [RbacRepository, RbacService],
  exports: [RbacService, RbacRepository],
})
export class RbacModule {}
