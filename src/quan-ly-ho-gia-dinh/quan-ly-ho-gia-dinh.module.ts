import { Module } from '@nestjs/common';
import { QuanLyHoGiaDinhService } from './quan-ly-ho-gia-dinh.service';
import { QuanLyHoGiaDinhController } from './quan-ly-ho-gia-dinh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BangDanToc,
  BangDanhSachDieuTra,
  BangDonVi,
  BangDotRaSoat,
  BangHuyen,
  BangKhuVucRaSoat,
  BangPhanLoaiHo,
  BangTenTruongThongTinTVH,
  BangThon,
  BangThongTinChuHo,
  BangThongTinHo,
  BangThongTinThanhVienHo,
  BangTinh,
  BangTruongThongTinHo,
  BangUser,
  BangXa,
} from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangThongTinChuHo,
      BangTruongThongTinHo,
      BangTenTruongThongTinTVH,
      BangUser,
      BangDanhSachDieuTra,
      BangDotRaSoat,
      BangThongTinHo,
      BangThongTinThanhVienHo,
      BangTinh,
      BangHuyen,
      BangXa,
      BangThon,
      BangKhuVucRaSoat,
      BangPhanLoaiHo,
      BangDonVi,
      BangDanToc,
    ]),
  ],
  providers: [
    {
      provide: Services.QUANLYHOGIADINH,
      useClass: QuanLyHoGiaDinhService,
    },
  ],
  exports: [
    {
      provide: Services.QUANLYHOGIADINH,
      useClass: QuanLyHoGiaDinhService,
    },
  ],
  controllers: [QuanLyHoGiaDinhController],
})
export class QuanLyHoGiaDinhModule {}
