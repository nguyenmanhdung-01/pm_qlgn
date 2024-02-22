import { Module } from '@nestjs/common';
import { DanhSachTaiLieuController } from './danh-sach-tai-lieu.controller';
import { DanhSachTaiLieuService } from './danh-sach-tai-lieu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BangDanhSachTaiLieu,
  MappingDotRaSoatVaTaiLieuLienQuan,
} from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangDanhSachTaiLieu,
      MappingDotRaSoatVaTaiLieuLienQuan,
    ]),
  ],

  controllers: [DanhSachTaiLieuController],
  providers: [
    {
      provide: Services.DANHSACHTAILIEU,
      useClass: DanhSachTaiLieuService,
    },
  ],
  exports: [
    {
      provide: Services.DANHSACHTAILIEU,
      useClass: DanhSachTaiLieuService,
    },
  ],
})
export class DanhSachTaiLieuModule {}
