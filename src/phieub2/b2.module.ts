import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangChiTieuB2 } from '../utils/typeorm';
import { B2Controller } from './b2.controller';
import { B2Service } from './b2.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangChiTieuB2])],
  controllers: [B2Controller],
  providers: [
    {
      provide: Services.B2,
      useClass: B2Service,
    },
  ],
  exports: [
    {
      provide: Services.B2,
      useClass: B2Service,
    },
  ],
})
export class B2Module {}
