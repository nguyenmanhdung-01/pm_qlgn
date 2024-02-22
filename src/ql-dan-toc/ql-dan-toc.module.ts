import { Module } from '@nestjs/common';
import { QlDanTocController } from './ql-dan-toc.controller';
import { QlDanTocService } from './ql-dan-toc.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangDanToc } from 'src/utils/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BangDanToc])],
  controllers: [QlDanTocController],
  providers: [
    {
      provide: Services.QUANLYDANTOC,
      useClass: QlDanTocService,
    },
  ],
  exports: [
    {
      provide: Services.QUANLYDANTOC,
      useClass: QlDanTocService,
    },
  ],
})
export class QlDanTocModule {}
