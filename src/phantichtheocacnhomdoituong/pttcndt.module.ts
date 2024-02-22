import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import {
  BangHuyen,
  BangKhuVucRaSoat,
  BangPhanTichTheoCacNhomDoiTuong,
  BangTinh,
} from '../utils/typeorm';
import { PTTCNDTController } from './pttcndt.controller';
import { PTTCNDTService } from './pttcndt.service';

// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangPhanTichTheoCacNhomDoiTuong,
      BangHuyen,
      BangKhuVucRaSoat,
      BangTinh,
    ]),
  ],
  controllers: [PTTCNDTController],
  providers: [
    {
      provide: Services.PTTCNDT,
      useClass: PTTCNDTService,
    },
  ],
  exports: [
    {
      provide: Services.PTTCNDT,
      useClass: PTTCNDTService,
    },
  ],
})
export class PTTCNDTModule {}
