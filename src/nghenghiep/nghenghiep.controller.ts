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
import { BangNgheNghiep } from 'src/utils/typeorm';
import { editNgheNghiep } from 'src/utils/types';
import { CreateNNDto } from './dtos/CreateNgheNghiep.dto';
import { INgheNghiepService } from './nghenghiep';

@Controller(Routes.NN)
export class NNController {
  constructor(
    @Inject(Services.NN) private readonly iService: INgheNghiepService,
  ) {}

  @Post('create')
  async create(@Body() CreateDto: CreateNNDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangNgheNghiep[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangNgheNghiep> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editNgheNghiep,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangNgheNghiep[]> {
    return this.iService.delete(idDelete);
  }
}
