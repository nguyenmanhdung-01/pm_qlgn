// /*
// https://docs.nestjs.com/providers#services
// */

// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { IRoleService } from './role';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Role } from 'src/utils/typeorm';
// import { Repository } from 'typeorm';
// import { CreateRoleDto } from './dtos/CreateRole.dto';

// @Injectable()
// export class RoleService implements IRoleService {
//   constructor(
//     @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
//   ) {}

//   async createRole(role: CreateRoleDto): Promise<Role> {
//     const existingRole = await this.roleRepository.findOne({
//       name: role.name,
//     });

//     if (existingRole)
//       throw new HttpException('Quyền đã tồn tại ', HttpStatus.CONFLICT);
//     const params = { name: role.name };
//     const newRole = await this.roleRepository.create(params);
//     const savedRole = await this.roleRepository.save(newRole);
//     return savedRole;
//   }

//   async getAllRole(): Promise<Role[]> {
//     const roles = await this.roleRepository.find();
//     return roles;
//   }

//   async getById(id: string): Promise<Role> {
//     const role = await this.roleRepository.findOne({ where: { id } });
//     if (!role)
//       throw new HttpException('Quyền không tồn tại ', HttpStatus.NOT_FOUND);
//     return role;
//   }
// }
