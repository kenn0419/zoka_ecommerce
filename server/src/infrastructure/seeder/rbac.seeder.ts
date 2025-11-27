import { Injectable } from '@nestjs/common';
import { RbacRepository } from 'src/modules/rbac/rbac.repository';
import { ROLE_PERMISSIONS } from 'src/common/rbac/role-permissions';
import { Role } from 'src/common/enums/role.enum';
import { Permission } from 'src/common/enums/permission.enum';

@Injectable()
export class RbacSeeder {
  constructor(private repo: RbacRepository) {}

  async seed() {
    console.log('🌱 Seeding RBAC...');

    // CREATE roles (theo enum)
    for (const roleName of Object.values(Role)) {
      await this.repo.ensureRole(crypto.randomUUID(), roleName);
    }

    // CREATE permissions (theo enum)
    for (const permName of Object.values(Permission)) {
      await this.repo.ensurePermission(permName);
    }

    // ASSIGN permissions to roles
    for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await this.repo.findRoleUnique({ name: roleName });

      if (!role) continue;

      for (const permName of perms) {
        const perm = await this.repo.findPermissionUnique({
          name: permName,
        });

        if (!perm) continue;

        await this.repo.ensureRolePermission(role.id, perm.id);
      }
    }

    console.log('✅ RBAC seeding completed.');
  }
}
