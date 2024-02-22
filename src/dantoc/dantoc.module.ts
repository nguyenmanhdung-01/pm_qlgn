import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangDanToc } from '../utils/typeorm';
import { DanTocController } from './dantoc.controller';
import { DanTocService } from './dantoc.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangDanToc])],
  controllers: [DanTocController],
  providers: [
    {
      provide: Services.DANTOC,
      useClass: DanTocService,
    },
  ],
  exports: [
    {
      provide: Services.DANTOC,
      useClass: DanTocService,
    },
  ],
})
export class DanTocModule {}
