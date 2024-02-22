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
import { BangChiTieuB1 } from 'src/utils/typeorm';
import { editB1 } from 'src/utils/types';
import { IPB1Service } from './b1';
import { CreatePhieuB1Dto } from './dtos/CreatePhieuB1.dto';

@Controller(Routes.B1)
export class B1Controller {
  constructor(@Inject(Services.B1) private readonly iService: IPB1Service) {}

  @Post('create')
  async create(@Body() CreateDto: CreatePhieuB1Dto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangChiTieuB1[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangChiTieuB1> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(@Param('id') id: number, @Body() editData: editB1): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangChiTieuB1[]> {
    return this.iService.delete(idDelete);
  }
}
