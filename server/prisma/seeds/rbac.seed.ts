import { ROLE_PERMISSIONS } from '../../src/common/rbac/role-permissions';
import { Role } from '../../src/common/enums/role.enum';
import { Permission } from '../../src/common/enums/permission.enum';
import { PrismaClient } from '../../generated/prisma';

export async function seedRBAC(prisma: PrismaClient) {
  console.log('→ Seeding RBAC...');

  // ========== ROLES ==========
  for (const role of Object.values(Role)) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: role,
      },
    });
  }

  // ========== PERMISSIONS ==========
  for (const perm of Object.values(Permission)) {
    await prisma.permission.upsert({
      where: { name: perm },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: perm,
      },
    });
  }

  // ========== ASSIGN PERMISSIONS TO ROLES ==========
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;

    for (const permName of perms) {
      const perm = await prisma.permission.findUnique({
        where: { name: permName },
      });
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
    }
  }

  console.log('✔ RBAC Seeding Completed');
}
