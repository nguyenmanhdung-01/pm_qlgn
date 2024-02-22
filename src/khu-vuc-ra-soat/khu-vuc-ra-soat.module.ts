import { Module } from '@nestjs/common';
import { KhuVucRaSoatController } from './khu-vuc-ra-soat.controller';
import { KhuVucRaSoatService } from './khu-vuc-ra-soat.service';
import { BangKhuVucRaSoat } from 'src/utils/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangKhuVucRaSoat])],

  controllers: [KhuVucRaSoatController],
  providers: [
    {
      provide: Services.KHUVUCRASOAT,
      useClass: KhuVucRaSoatService,
    },
  ],
  exports: [
    {
      provide: Services.KHUVUCRASOAT,
      useClass: KhuVucRaSoatService,
    },
  ],
})
export class KhuVucRaSoatModule {}
