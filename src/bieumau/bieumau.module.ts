import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangDanhSachBieuMau } from '../utils/typeorm';

import { BieuMauService } from './bieumau.service';
import { BieuMauController } from './bieumau.controller';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangDanhSachBieuMau])],
  controllers: [BieuMauController],
  providers: [
    {
      provide: Services.BIEUMAU,
      useClass: BieuMauService,
    },
  ],
  exports: [
    {
      provide: Services.BIEUMAU,
      useClass: BieuMauService,
    },
  ],
})
export class BieuMauModule {}
