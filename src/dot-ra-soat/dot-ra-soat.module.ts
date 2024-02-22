import { Module } from '@nestjs/common';
import { DotRaSoatController } from './dot-ra-soat.controller';
import { DotRaSoatService } from './dot-ra-soat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BangDanhSachDieuTra,
  BangDotRaSoat,
  MappingDotRaSoatVaTaiLieuLienQuan,
} from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangDotRaSoat,
      BangDanhSachDieuTra,
      MappingDotRaSoatVaTaiLieuLienQuan,
    ]),
  ],

  controllers: [DotRaSoatController],
  providers: [
    {
      provide: Services.DOTRASOAT,
      useClass: DotRaSoatService,
    },
  ],
  exports: [
    {
      provide: Services.DOTRASOAT,
      useClass: DotRaSoatService,
    },
  ],
})
export class DotRaSoatModule {}
