import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangHuyen, BangTinh } from '../utils/typeorm';
import { HuyenController } from './huyen.controller';
import { HuyenService } from './huyen.service';
import { TinhModule } from 'src/tinh/tinh.module';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangHuyen, BangTinh]), TinhModule],
  controllers: [HuyenController],
  providers: [
    {
      provide: Services.HUYEN,
      useClass: HuyenService,
    },
  ],
  exports: [
    {
      provide: Services.HUYEN,
      useClass: HuyenService,
    },
  ],
})
export class HuyenModule {}
