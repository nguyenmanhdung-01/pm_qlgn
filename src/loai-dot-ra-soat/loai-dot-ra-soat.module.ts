import { Module } from '@nestjs/common';
import { LoaiDotRaSoatController } from './loai-dot-ra-soat.controller';
import { LoaiDotRaSoatService } from './loai-dot-ra-soat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangLoaiDotRaSoat } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangLoaiDotRaSoat])],

  controllers: [LoaiDotRaSoatController],
  providers: [
    {
      provide: Services.LOAIDOTRASOAT,
      useClass: LoaiDotRaSoatService,
    },
  ],
  exports: [
    {
      provide: Services.LOAIDOTRASOAT,
      useClass: LoaiDotRaSoatService,
    },
  ],
})
export class LoaiDotRaSoatModule {}
