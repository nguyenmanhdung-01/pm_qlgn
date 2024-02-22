import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangChiTieuB1 } from '../utils/typeorm';
import { B1Controller } from './b1.controller';
import { B1Service } from './b1.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangChiTieuB1])],
  controllers: [B1Controller],
  providers: [
    {
      provide: Services.B1,
      useClass: B1Service,
    },
  ],
  exports: [
    {
      provide: Services.B1,
      useClass: B1Service,
    },
  ],
})
export class B1Module {}
