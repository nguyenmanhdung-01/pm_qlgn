import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangNgheNghiep } from '../utils/typeorm';
import { NNController } from './nghenghiep.controller';
import { NgheNghiepService } from './nghenghiep.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangNgheNghiep])],
  controllers: [NNController],
  providers: [
    {
      provide: Services.NN,
      useClass: NgheNghiepService,
    },
  ],
  exports: [
    {
      provide: Services.NN,
      useClass: NgheNghiepService,
    },
  ],
})
export class NNModule {}
