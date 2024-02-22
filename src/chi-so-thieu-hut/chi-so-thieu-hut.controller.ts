import {
  Controller,
  Get,
  Inject,
  Query,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IChiSoThieuHut } from './chi-so-thieu-hut';
import { FileInterceptor } from '@nestjs/platform-express';
import { createChiSoDto } from './dtos/createChiSoDto.dto';

@Controller(Routes.CSTH)
export class ChiSoThieuHutController {
  constructor(
    @Inject(Services.CSTH)
    private readonly chiSoThieuHutRepository: IChiSoThieuHut,
  ) {}

  @Get('getDataChiSo')
  async fetchDataByXaID(
    @Query('PhanLoaiHoID') PhanLoaiHoID: number,
    @Query('TinhID') TinhID: number,
    @Query('HuyenID') HuyenID: number,
    @Query('thoiDiemKetXuat') thoiDiemKetXuat: number,
  ) {
    return this.chiSoThieuHutRepository.getChiSoByID(
      PhanLoaiHoID,
      TinhID,
      HuyenID,
      thoiDiemKetXuat,
    );
  }

  @Post('chiSoThieuHut/uploadExcel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() khuVuc: createChiSoDto,
  ) {
    const results = await this.chiSoThieuHutRepository.processExcelFile(
      file,
      khuVuc,
    );
    return results;
  }

  @Get('thoiDiemKX')
  async getThoiDiemKetXuat() {
    return await this.chiSoThieuHutRepository.getThoiDiemKetXuat();
  }

  @Post('importEx')
  async generateExcel(@Body() data: any) {
    // Định nghĩa và chuyển dữ liệu của bạn khi cần
    // console.log('xg day: ', data);

    return await this.chiSoThieuHutRepository.generateExcelFile(data);
  }
}
