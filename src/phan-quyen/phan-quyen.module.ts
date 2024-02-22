import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhanQuyenController } from './phan-quyen.controller';
import { PhanQuyenService } from './phan-quyen.service';
import { BangRoleUser } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangRoleUser])],
  controllers: [PhanQuyenController],
  providers: [
    {
      provide: Services.PHANQUYEN,
      useClass: PhanQuyenService,
    },
  ],
  exports: [
    {
      provide: Services.PHANQUYEN,
      useClass: PhanQuyenService,
    },
  ],
})
export class PhanQuyenModule {}
