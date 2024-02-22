import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangDanhSachTaiLieu } from '../utils/typeorm';

import { BaoCaoService } from './baocao.service';
import { BaoCaoController } from './baocao.controller';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangDanhSachTaiLieu])],
  controllers: [BaoCaoController],
  providers: [
    {
      provide: Services.BAOCAO,
      useClass: BaoCaoService,
    },
  ],
  exports: [
    {
      provide: Services.BAOCAO,
      useClass: BaoCaoService,
    },
  ],
})
export class BaoCaoModule {}
