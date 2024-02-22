import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TLNPLService } from './tlnpl.service';
import { TLNPLController } from './tlnpl.controller';
import { BangThietLapNguongPL } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangThietLapNguongPL])],
  controllers: [TLNPLController],
  providers: [
    {
      provide: Services.TLNPL,
      useClass: TLNPLService,
    },
  ],
  exports: [
    {
      provide: Services.TLNPL,
      useClass: TLNPLService,
    },
  ],
})
export class TLNPLNModule {}
