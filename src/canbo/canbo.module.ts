import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangCanBo } from '../utils/typeorm';
import { CanBoController } from './canbo.controller';
import { CanBoService } from './canbo.service';

@Module({
  imports: [TypeOrmModule.forFeature([BangCanBo])],
  controllers: [CanBoController],
  providers: [
    {
      provide: Services.CB,
      useClass: CanBoService,
    },
  ],
  exports: [
    {
      provide: Services.CB,
      useClass: CanBoService,
    },
  ],
})
export class CanBoModule {}
