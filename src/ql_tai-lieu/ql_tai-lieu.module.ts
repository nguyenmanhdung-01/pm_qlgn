import { Module } from '@nestjs/common';
import { QlTaiLieuController } from './ql_tai-lieu.controller';
import { QlTaiLieuService } from './ql_tai-lieu.service';
import { Services } from 'src/utils/constants';
import {
  BangDanhSachTaiLieu,
  BangDonVi,
  BangPhanLoaiTaiLieu,
  BangThongTinHo,
  BangUser,
} from 'src/utils/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangDanhSachTaiLieu,
      BangUser,
      BangPhanLoaiTaiLieu,
      BangDonVi,
      BangThongTinHo,
    ]),
  ],
  controllers: [QlTaiLieuController],
  providers: [
    {
      provide: Services.QUANLYTAILIEU,
      useClass: QlTaiLieuService,
    },
  ],
  exports: [
    {
      provide: Services.QUANLYTAILIEU,
      useClass: QlTaiLieuService,
    },
  ],
})
export class QlTaiLieuModule {}
