import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangHuyen, BangXa } from '../utils/typeorm';
import { XAController } from './xa.controller';
import { HuyenModule } from 'src/huyen/huyen.module';
import { XaService } from './xa.service';

@Module({
  imports: [TypeOrmModule.forFeature([BangXa, BangHuyen]), HuyenModule],
  controllers: [XAController],
  providers: [
    {
      provide: Services.XA,
      useClass: XaService,
    },
  ],
  exports: [
    {
      provide: Services.XA,
      useClass: XaService,
    },
  ],
})
export class XaModule {}
