import { Module } from '@nestjs/common';
import { NhomQuyenController } from './nhom-quyen.controller';
import { NhomQuyenService } from './nhom-quyen.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BangRoleGroup, BangRoleUser, BangUser } from 'src/utils/typeorm';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([BangRoleGroup, BangRoleUser, BangUser])],
  controllers: [NhomQuyenController],
  providers: [
    {
      provide: Services.NHOMQUYEN,
      useClass: NhomQuyenService,
    },
  ],
  exports: [
    {
      provide: Services.NHOMQUYEN,
      useClass: NhomQuyenService,
    },
  ],
})
export class NhomQuyenModule {}
