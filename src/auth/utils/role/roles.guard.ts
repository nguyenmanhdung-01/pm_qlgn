import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import RoleEnum from 'src/utils/types';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const test = requiredRoles.some((role) =>
      user?.roles?.map((item) => item.name)?.includes(role),
    );
    console.log('user', user);
    console.log(
      'test',
      user?.roles?.map((item) => item.name),
    );
    console.log('requiredRoles', requiredRoles);

    return test;
  }
}
