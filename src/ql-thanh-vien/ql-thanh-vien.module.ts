import { Module } from '@nestjs/common';
import { QlThanhVienController } from './ql-thanh-vien.controller';
import { QlThanhVienService } from './ql-thanh-vien.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BangDanToc,
  BangThongTinChuHo,
  BangThongTinHo,
  BangThongTinThanhVienHo,
} from 'src/utils/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BangThongTinThanhVienHo,
      BangDanToc,
      BangThongTinHo,
      BangThongTinChuHo,
    ]),
  ],
  controllers: [QlThanhVienController],
  providers: [
    {
      provide: Services.QUANLYTHANHVIEN,
      useClass: QlThanhVienService,
    },
  ],
  exports: [
    {
      provide: Services.QUANLYTHANHVIEN,
      useClass: QlThanhVienService,
    },
  ],
})
export class QlThanhVienModule {}
