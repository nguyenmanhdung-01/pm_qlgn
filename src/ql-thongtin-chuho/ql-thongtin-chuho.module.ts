import { Module } from '@nestjs/common';
import { QlThongtinChuhoController } from './ql-thongtin-chuho.controller';
import { QlThongtinChuhoService } from './ql-thongtin-chuho.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangThongTinChuHo, BangThongTinHo } from 'src/utils/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BangThongTinChuHo, BangThongTinHo])],
  controllers: [QlThongtinChuhoController],
  providers: [
    {
      provide: Services.TTCHUHO,
      useClass: QlThongtinChuhoService,
    },
  ],
  exports: [
    {
      provide: Services.TTCHUHO,
      useClass: QlThongtinChuhoService,
    },
  ],
})
export class QlThongtinChuhoModule {}
