import { Module } from '@nestjs/common';
import { LichSuPhanLoaiHoController } from './lich-su-phan-loai-ho.controller';
import { LichSuPhanLoaiHoService } from './lich-su-phan-loai-ho.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangLichSuPhanLoaiHo } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangLichSuPhanLoaiHo])],
  controllers: [LichSuPhanLoaiHoController],
  providers: [
    {
      provide: Services.LSPLH,
      useClass: LichSuPhanLoaiHoService,
    },
  ],
  exports: [
    {
      provide: Services.LSPLH,
      useClass: LichSuPhanLoaiHoService,
    },
  ],
})
export class LichSuPhanLoaiHoModule {}
