import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangDonVi } from '../utils/typeorm';
import { DonViController } from './donvi.controller';
import { DonViService } from './donvi.service';

@Module({
  imports: [TypeOrmModule.forFeature([BangDonVi])],
  controllers: [DonViController],
  providers: [
    {
      provide: Services.DV,
      useClass: DonViService,
    },
  ],
  exports: [
    {
      provide: Services.DV,
      useClass: DonViService,
    },
  ],
})
export class DonViModule {}
