import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import {
  BangChinhSach,
  BangPhanLoaiHo,
  BangPhanLoaiTaiLieu,
  BangTinh,
} from '../utils/typeorm';
import { ChinhSachController } from './chinhsach.controller';
import { ChinhSachService } from './chinhsach.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangChinhSach])],
  controllers: [ChinhSachController],
  providers: [
    {
      provide: Services.CS,
      useClass: ChinhSachService,
    },
  ],
  exports: [
    {
      provide: Services.CS,
      useClass: ChinhSachService,
    },
  ],
})
export class ChinhSachModule {}
