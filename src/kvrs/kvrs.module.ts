import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangDotRaSoat, BangKhuVucRaSoat } from '../utils/typeorm';
import { KVRSoController } from './kvrs.controller';
import { KVRSService } from './kvrs.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangKhuVucRaSoat, BangDotRaSoat])],
  controllers: [KVRSoController],
  providers: [
    {
      provide: Services.KVRS,
      useClass: KVRSService,
    },
  ],
  exports: [
    {
      provide: Services.KVRS,
      useClass: KVRSService,
    },
  ],
})
export class KVRSModule {}
