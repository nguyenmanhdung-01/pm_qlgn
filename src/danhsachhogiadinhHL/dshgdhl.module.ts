import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';

import { DSHGDHLService } from './dshgdhl.service';
import { DSHGDHLController } from './dshgdhl.controller';
import { BangThongTinHoHL } from 'src/utils/typeorm/entities/BangThongTinHoGiaDinhHL';
import { XaModule } from 'src/xa/xa.module';

// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangThongTinHoHL]), XaModule],
  controllers: [DSHGDHLController],
  providers: [
    {
      provide: Services.DSHGDHL,
      useClass: DSHGDHLService,
    },
  ],
  exports: [
    {
      provide: Services.DSHGDHL,
      useClass: DSHGDHLService,
    },
  ],
})
export class DSHGDHLModule {}
