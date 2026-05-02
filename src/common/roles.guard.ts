import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';          // ← ajoute
import { ROLES_KEY } from './roles.decorator'; // ← ajoute

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Accès refusé : rôle manquant');
    }

    const hasRole = requiredRoles.includes(user.role as Role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Accès refusé : rôle '${user.role}' non autorisé`,
      );
    }

    return true;
  }
}
