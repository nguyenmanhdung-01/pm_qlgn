import { Module } from '@nestjs/common';
import { DanhSachDieuTraController } from './danh-sach-dieu-tra.controller';
import { DanhSachDieuTraService } from './danh-sach-dieu-tra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BangDanhSachDieuTra,
  BangDanhSachTaiLieu,
  BangThongTinChuHo,
  BangThongTinHo,
} from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangDanhSachDieuTra,
      BangThongTinHo,
      BangDanhSachTaiLieu,
      BangThongTinChuHo,
    ]),
  ],
  controllers: [DanhSachDieuTraController],
  providers: [
    {
      provide: Services.DANHSACHDIEUTRA,
      useClass: DanhSachDieuTraService,
    },
  ],
  exports: [
    {
      provide: Services.DANHSACHDIEUTRA,
      useClass: DanhSachDieuTraService,
    },
  ],
})
export class DanhSachDieuTraModule {}
