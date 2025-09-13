import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Permission } from './permissions.type';
import AuthRequest from './auth.request';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) return false;

    return requiredPermissions.every((perm) => user.permissions.includes(perm));
  }
}
