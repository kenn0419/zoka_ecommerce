import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ROLE_KEY } from '../decorators/role.decorator';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');
    const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [];
    const userPermissions: string[] = Array.isArray(user.permissions)
      ? user.permissions
      : [];
    if (requiredRoles?.length) {
      const hasRole = requiredRoles.some((role) => userRoles?.includes(role));
      if (!hasRole)
        throw new ForbiddenException('You do not have access (role)');
    }

    if (requiredPermissions?.length) {
      const hasPermission = requiredPermissions.some((p) =>
        userPermissions?.includes(p),
      );

      if (!hasPermission)
        throw new ForbiddenException('You do not have access (permission)');
    }

    return true;
  }
}
