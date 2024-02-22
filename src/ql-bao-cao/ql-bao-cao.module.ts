import { Module } from '@nestjs/common';
import { QlBaoCaoController } from './ql-bao-cao.controller';
import { QlBaoCaoService } from './ql-bao-cao.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangDanhSachBaoCao } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangDanhSachBaoCao])],
  controllers: [QlBaoCaoController],
  providers: [
    {
      provide: Services.QUANLYBAOCAO,
      useClass: QlBaoCaoService,
    },
  ],
  exports: [
    {
      provide: Services.QUANLYBAOCAO,
      useClass: QlBaoCaoService,
    },
  ],
})
export class QlBaoCaoModule {}
