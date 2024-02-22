import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangPhanLoaiHo, BangTinh } from '../utils/typeorm';
import { PLHoController } from './plho.controller';
import { PLHoService } from './plho.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangPhanLoaiHo])],
  controllers: [PLHoController],
  providers: [
    {
      provide: Services.PLHO,
      useClass: PLHoService,
    },
  ],
  exports: [
    {
      provide: Services.PLHO,
      useClass: PLHoService,
    },
  ],
})
export class PLHoModule {}
