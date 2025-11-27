import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RbacRepository } from './rbac.repository';

@Injectable()
export class RbacService {
  constructor(private rbacRepo: RbacRepository) {}

  async createRole(name: string, description?: string) {
    const existed = await this.rbacRepo.findRoleUnique({ name });
    if (existed) throw new ConflictException('Role already exists');

    return this.rbacRepo.createRole({
      id: crypto.randomUUID(),
      name,
      description,
    });
  }

  async createPermission(name: string, description?: string) {
    const existed = await this.rbacRepo.findPermissionUnique({ name });
    if (existed) throw new ConflictException('Permission already exists');

    return this.rbacRepo.createPermission({
      id: crypto.randomUUID(),
      name,
      description,
    });
  }

  async assignRole(userId: string, roleName: string) {
    const role = await this.rbacRepo.findRoleUnique({ name: roleName });
    if (!role) throw new NotFoundException('Role not found');

    return this.rbacRepo.assignRole(userId, role.id);
  }

  async assignPermissionToRole(roleName: string, permissionName: string) {
    const role = await this.rbacRepo.findRoleUnique({ name: roleName });
    if (!role) throw new NotFoundException('Role not found');

    const perm = await this.rbacRepo.findPermissionUnique({
      name: permissionName,
    });
    if (!perm) throw new NotFoundException('Permission not found');

    return this.rbacRepo.assignPermissionToRole(role.id, perm.id);
  }

  getUserRolesPermissions(userId: string) {
    return this.rbacRepo.getUserRolesPermissions(userId);
  }

  findAllRoles() {
    return this.rbacRepo.findAllRoles();
  }

  findAllPermissions() {
    return this.rbacRepo.findAllPermissions();
  }
}
