import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/user/enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Payload } from '../dto/payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: Payload }>();

    const user = request.user;

    if (!user || !user.role) return false;
    return requiredRoles.some((role) => user.role === role);
  }
}
