import { Module } from '@nestjs/common';
import { ChiSoThieuHutController } from './chi-so-thieu-hut.controller';
import { ChiSoThieuHutService } from './chi-so-thieu-hut.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangChiSoThieuHutDVXHCB, BangKhuVucRaSoat } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([BangChiSoThieuHutDVXHCB, BangKhuVucRaSoat]),
  ],
  controllers: [ChiSoThieuHutController],
  providers: [
    {
      provide: Services.CSTH,
      useClass: ChiSoThieuHutService,
    },
  ],
  exports: [
    {
      provide: Services.CSTH,
      useClass: ChiSoThieuHutService,
    },
  ],
})
export class ChiSoThieuHutModule {}
