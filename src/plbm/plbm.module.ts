import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangLoaiBieuMau } from '../utils/typeorm';
import { PLBMController } from './plbm.controller';
import { PLBMService } from './plbm.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangLoaiBieuMau])],
  controllers: [PLBMController],
  providers: [
    {
      provide: Services.PLBM,
      useClass: PLBMService,
    },
  ],
  exports: [
    {
      provide: Services.PLBM,
      useClass: PLBMService,
    },
  ],
})
export class PLMBModule {}
