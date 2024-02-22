import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { BangPhanLoaiHo } from 'src/utils/typeorm';
import { editPLHo, editTinh } from 'src/utils/types';
import { IPLHoService } from './plho';
import { CreatePhanLoaiHoDto } from './dtos/CreatePhanLoaiHo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
@Controller(Routes.PLHO)
export class PLHoController {
  constructor(@Inject(Services.PLHO) private readonly iService: IPLHoService) {}

  @Post('create')
  async create(@Body() CreateDto: CreatePhanLoaiHoDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangPhanLoaiHo[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangPhanLoaiHo> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editPLHo,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangPhanLoaiHo[]> {
    return this.iService.delete(idDelete);
  }
}
