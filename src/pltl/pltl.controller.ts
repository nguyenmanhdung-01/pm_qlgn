import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { BangPhanLoaiTaiLieu } from 'src/utils/typeorm';
import { editPLHo, editPLTL, editTinh } from 'src/utils/types';
import { IPLTLService } from './pltl';
import { CreatePLTLDto } from './dtos/CreatePLTL.dto';

@Controller(Routes.PLTL)
export class PLTLController {
  constructor(@Inject(Services.PLTL) private readonly iService: IPLTLService) {}

  @Post('create')
  async create(@Body() CreateDto: CreatePLTLDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangPhanLoaiTaiLieu[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangPhanLoaiTaiLieu> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editPLTL,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangPhanLoaiTaiLieu[]> {
    return this.iService.delete(idDelete);
  }
}
