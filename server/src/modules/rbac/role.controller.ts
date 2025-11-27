import { Body, Controller, Get, Post } from '@nestjs/common';
import { RbacService } from './rbac.service';

@Controller('roles')
export class RoleController {
  constructor(private rbacService: RbacService) {}

  @Post()
  create(@Body() dto: { name: string; description?: string }) {
    return this.rbacService.createRole(dto.name, dto.description);
  }

  @Get()
  findAll() {
    return this.rbacService.findAllRoles();
  }
}
