import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangTinh, BangVung } from '../utils/typeorm';
import { TinhController } from './tinh.controller';
import { TinhService } from './tinh.service';
import { VungModule } from 'src/vung/vung.module';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangTinh, BangVung]), VungModule],
  controllers: [TinhController],
  providers: [
    {
      provide: Services.TINH,
      useClass: TinhService,
    },
  ],
  exports: [
    {
      provide: Services.TINH,
      useClass: TinhService,
    },
  ],
})
export class TinhModule {}
