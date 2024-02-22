// import { Services } from 'src/utils/constants';
// import { RoleController } from './role.controller';
// import { RoleService } from './role.service';
// import { Module } from '@nestjs/common';
// import { Role } from 'src/utils/typeorm';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [TypeOrmModule.forFeature([Role])],

//   controllers: [RoleController],
//   providers: [
//     {
//       provide: Services.ROLE,
//       useClass: RoleService,
//     },
//   ],
//   exports: [
//     {
//       provide: Services.ROLE,
//       useClass: RoleService,
//     },
//   ],
// })
// export class RoleModule {}
