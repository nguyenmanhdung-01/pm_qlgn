import {
  Controller,
  Inject,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Routes, Services } from 'src/utils/constants';
import { IDanhSachTaiLieu } from './danh-sach-tai-lieu';

@Controller(Routes.DANHSACHTAILIEU)
export class DanhSachTaiLieuController {
  constructor(
    @Inject(Services.DANHSACHTAILIEU)
    private readonly danhSachTaiLieuService: IDanhSachTaiLieu,
  ) {}

  @Get('danhSachTaiLieuTheoDot/:DotRaSoatID')
  async getTaiLieuTheoDotRaSoat(
    @Param('DotRaSoatID', ParseIntPipe) DotRaSoatID: number,
  ) {
    // console.log('DotRaSoatID: ', DotRaSoatID);

    const danhSachTaiLieuTheoDot =
      await this.danhSachTaiLieuService.getTaiLieuTheoDotRaSoat(DotRaSoatID);
    return danhSachTaiLieuTheoDot;
  }
  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../pm_qlgn/public/uploads',
        filename: (req, file, callback) => {
          const randomName = Date.now();
          const originalName = Buffer.from(
            file.originalname,
            'latin1',
          ).toString('utf8');

          const fileName = randomName + '-' + originalName;
          callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
        fieldSize: 10 * 1024 * 1024,
      },
    }),
  )
  uploadFileImage(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: file.filename };
  }
  @Post('danhSachTaiLieu')
  async createDotRaSoat(@Body() danhSachTaiLieuDetail: any) {
    const dotRaSoatSaved =
      await this.danhSachTaiLieuService.createDanhSachTaiLieu(
        danhSachTaiLieuDetail,
      );
    return dotRaSoatSaved;
  }

  @Put('danhSachTaiLieu')
  async editDanhSachTaiLieu(@Body() danhSachTaiLieuEdit: any) {
    const result = await this.danhSachTaiLieuService.editDanhSachTaiLieu(
      danhSachTaiLieuEdit,
    );
    return result;
  }

  @Delete('danhSachTaiLieuDetail')
  async deleteOneHoGiaDinh(@Body() TaiLieuID: any) {
    const result = await this.danhSachTaiLieuService.deleteOneDanhSachTaiLieu(
      TaiLieuID,
    );
    return result;
  }

  @Delete('danhSachTaiLieu')
  async deleteManyHoGiaDinh(@Body() TaiLieuIDs: number[]) {
    const result = await this.danhSachTaiLieuService.deleteManyDanhSachTaiLieu(
      TaiLieuIDs,
    );
    return result;
  }
}
