import { Module } from '@nestjs/common';
import { QuanLyHoGiaDinhHlController } from './quan-ly-ho-gia-dinh-hl.controller';
import { QuanLyHoGiaDinhHlService } from './quan-ly-ho-gia-dinh-hl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangThongTinHoHL } from 'src/utils/typeorm/entities/BangThongTinHoGiaDinhHL';
import { Services } from 'src/utils/constants';
import {
  BangDonVi,
  BangDotRaSoat,
  BangHuyen,
  BangKhuVucRaSoat,
  BangPhanLoaiHo,
  BangThon,
  BangXa,
} from 'src/utils/typeorm';
import { ThonModule } from 'src/thon/thon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangThongTinHoHL,
      BangKhuVucRaSoat,
      BangHuyen,
      BangXa,
      BangPhanLoaiHo,
      BangThon,
      BangDonVi,
      BangDotRaSoat,
    ]),
  ],
  controllers: [QuanLyHoGiaDinhHlController],
  providers: [
    {
      provide: Services.QUANLYHOGIADINHHL,
      useClass: QuanLyHoGiaDinhHlService,
    },
  ],
  exports: [
    {
      provide: Services.QUANLYHOGIADINHHL,
      useClass: QuanLyHoGiaDinhHlService,
    },
  ],
})
export class QuanLyHoGiaDinhHlModule {}
