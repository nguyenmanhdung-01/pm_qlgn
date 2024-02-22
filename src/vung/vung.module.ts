import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangVung } from '../utils/typeorm';
import { VungController } from './vung.controller';
import { VungService } from './vung.service';

@Module({
  imports: [TypeOrmModule.forFeature([BangVung])],
  controllers: [VungController],
  providers: [
    {
      provide: Services.VUNG,
      useClass: VungService,
    },
  ],
  exports: [
    {
      provide: Services.VUNG,
      useClass: VungService,
    },
  ],
})
export class VungModule {}
