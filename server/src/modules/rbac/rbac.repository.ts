import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class RbacRepository {
  constructor(private prisma: PrismaService) {}

  createRole(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data });
  }

  findRoleUnique(where: Prisma.RoleWhereUniqueInput) {
    return this.prisma.role.findUnique({ where });
  }

  findAllRoles() {
    return this.prisma.role.findMany();
  }

  createPermission(data: Prisma.PermissionCreateInput) {
    return this.prisma.permission.create({ data });
  }

  findPermissionUnique(where: Prisma.PermissionWhereUniqueInput) {
    return this.prisma.permission.findUnique({ where });
  }

  findAllPermissions() {
    return this.prisma.permission.findMany();
  }

  assignRole(userId: string, roleId: string) {
    return this.prisma.userRole.create({ data: { userId, roleId } });
  }

  assignPermissionToRole(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.create({
      data: { roleId, permissionId },
    });
  }

  async getUserRolesPermissions(userId: string) {
    const rows = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    const roles = rows.map((r) => r.role.name);
    const permissions = rows.flatMap((r) =>
      r.role.permissions.map((p) => p.permission.name),
    );

    return { roles, permissions };
  }

  async ensureRole(id: string, name: string) {
    return this.prisma.role.upsert({
      where: { name },
      update: {},
      create: { id, name },
    });
  }

  async ensurePermission(name: string) {
    return this.prisma.permission.upsert({
      where: { name },
      update: {},
      create: { id: crypto.randomUUID(), name },
    });
  }

  async ensureRolePermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      update: {},
      create: { roleId, permissionId },
    });
  }
}
