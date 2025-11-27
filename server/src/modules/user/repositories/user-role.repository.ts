import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRoleRepository {
  constructor(private prisma: PrismaService) {}

  async getUserRolesPermissions(userId: string) {
    const roles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const roleNames = roles.map((r) => r.role.name);
    const perrmissionNames = roles.flatMap((r) =>
      r.role.permissions.map((p) => p.permission.name),
    );

    return { roleNames, perrmissionNames };
  }
}
