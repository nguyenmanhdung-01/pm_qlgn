import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangThon, BangXa } from '../utils/typeorm';
import { ThonController } from './thon.controller';
import { ThonService } from './thon.service';

@Module({
  imports: [TypeOrmModule.forFeature([BangThon, BangXa])],
  controllers: [ThonController],
  providers: [
    {
      provide: Services.THON,
      useClass: ThonService,
    },
  ],
  exports: [
    {
      provide: Services.THON,
      useClass: ThonService,
    },
  ],
})
export class ThonModule {}
