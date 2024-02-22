import {
  Controller,
  Inject,
  Body,
  Post,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Routes, Services } from '../utils/constants';
import { IHGDHLService } from './dshgdhl';
import { CreateDSHGDHLDto } from './dtos/CreateDSHGDHL.dto';
import * as fs from 'fs';
import { BangThongTinHoHL } from 'src/utils/typeorm/entities/BangThongTinHoGiaDinhHL';
@Controller(Routes.DSHGDHL)
export class DSHGDHLController {
  constructor(
    @Inject(Services.DSHGDHL) private readonly iService: IHGDHLService,
  ) {}

  @Post('create')
  async create(
    @Body() createDto: CreateDSHGDHLDto,
  ): Promise<BangThongTinHoHL[]> {
    const { DonViID, KhuVucRaSoatID, dotRaSoatID, createDetails } = createDto;
    // console.log('createDto: ', DonViID);

    return this.iService.create(
      DonViID,
      KhuVucRaSoatID,
      dotRaSoatID,
      createDetails,
    );
  }

  @Get('getAll')
  async getAll(): Promise<BangThongTinHoHL[]> {
    return this.iService.getAll();
  }

  @Get('getByDRS/:id')
  async getByDRS(@Param('id') id: number): Promise<any> {
    return this.iService.getByDRS(id);
  }

  @Post('/exportfile/exel09')
  async exportFileExel(@Body() data: any[]) {
    const outputPath = await this.iService.exportDanhSach09(data);
    return outputPath;

    // res.download(outputPath, 'bao_cao_09.xlsx', (err) => {
    //   if (err) {
    //     console.error('Lỗi khi tải tệp:', err);
    //   }
    //   fs.unlinkSync(outputPath); // Xóa tệp sau khi tải
    // });
  }
}
