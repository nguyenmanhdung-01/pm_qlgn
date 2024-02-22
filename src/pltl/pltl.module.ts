import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import {
  BangPhanLoaiHo,
  BangPhanLoaiTaiLieu,
  BangTinh,
} from '../utils/typeorm';
import { PLTLController } from './pltl.controller';
import { PLTLService } from './pltl.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangPhanLoaiTaiLieu])],
  controllers: [PLTLController],
  providers: [
    {
      provide: Services.PLTL,
      useClass: PLTLService,
    },
  ],
  exports: [
    {
      provide: Services.PLTL,
      useClass: PLTLService,
    },
  ],
})
export class PLTLModule {}
