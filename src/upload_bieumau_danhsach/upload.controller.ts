import {
  Controller,
  Inject,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IUpLoadFileService } from './upload';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(Routes.UPLOAD)
export class UploadController {
  constructor(
    @Inject(Services.UPLOAD) private readonly iService: IUpLoadFileService,
  ) {}

  @Post('file/badanhsach')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file): Promise<any> {
    return this.iService.uploadDanhSach(file);
  }
}
