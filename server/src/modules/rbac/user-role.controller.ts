import { Body, Controller, Post } from '@nestjs/common';
import { RbacService } from './rbac.service';

@Controller('user-role')
export class UserRoleController {
  constructor(private rbacService: RbacService) {}

  @Post('assign')
  assignRole(@Body() dto: { userId: string; roleName: string }) {
    return this.rbacService.assignRole(dto.userId, dto.roleName);
  }

  @Post('assign-permission')
  assignPermission(@Body() dto: { roleName: string; permissionName: string }) {
    return this.rbacService.assignPermissionToRole(
      dto.roleName,
      dto.permissionName,
    );
  }
}
