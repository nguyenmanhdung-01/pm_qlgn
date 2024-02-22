import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { UpLoadFileService } from './upload.service';
import { UploadController } from './upload.controller';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [
    {
      provide: Services.UPLOAD,
      useClass: UpLoadFileService,
    },
  ],
  exports: [
    {
      provide: Services.UPLOAD,
      useClass: UpLoadFileService,
    },
  ],
})
export class UpLoadModule {}
