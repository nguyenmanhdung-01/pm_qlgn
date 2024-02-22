// /*
// https://docs.nestjs.com/controllers#controllers
// */
// import { Controller, Get, Inject, Param, Post, Body } from '@nestjs/common';
// import { Routes, Services } from 'src/utils/constants';
// import { IRoleService } from './role';
// import { CreateRoleDto } from './dtos/CreateRole.dto';

// @Controller(Routes.ROLE)
// export class RoleController {
//   constructor(
//     @Inject(Services.ROLE) private readonly roleService: IRoleService,
//   ) {}

//   @Post('createRole')
//   async createRole(@Body() role: CreateRoleDto) {
//     const savedRole = await this.roleService.createRole(role);
//     return savedRole;
//   }

//   @Get('getAll')
//   async getAllRole() {
//     const roles = await this.roleService.getAllRole();
//     return roles;
//   }
// }
