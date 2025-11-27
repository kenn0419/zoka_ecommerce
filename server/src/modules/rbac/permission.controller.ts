import { Body, Controller, Get, Post } from '@nestjs/common';
import { RbacService } from './rbac.service';

@Controller('permissions')
export class PermissionController {
  constructor(private rbacService: RbacService) {}

  @Post()
  create(@Body() dto: { name: string; description?: string }) {
    return this.rbacService.createPermission(dto.name, dto.description);
  }

  @Get()
  findAll() {
    return this.rbacService.findAllPermissions();
  }
}
