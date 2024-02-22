import { Module } from '@nestjs/common';
import { PhanLoaiTaiLieuController } from './phan-loai-tai-lieu.controller';
import { PhanLoaiTaiLieuService } from './phan-loai-tai-lieu.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangPhanLoaiTaiLieu } from 'src/utils/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BangPhanLoaiTaiLieu])],

  controllers: [PhanLoaiTaiLieuController],
  providers: [
    {
      provide: Services.LOAITAILIEU,
      useClass: PhanLoaiTaiLieuService,
    },
  ],
  exports: [
    {
      provide: Services.LOAITAILIEU,
      useClass: PhanLoaiTaiLieuService,
    },
  ],
})
export class PhanLoaiTaiLieuModule {}
