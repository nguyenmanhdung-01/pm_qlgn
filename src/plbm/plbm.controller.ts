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
import { BangLoaiBieuMau } from 'src/utils/typeorm';
import { editPLBM } from 'src/utils/types';
import { IPLBMService } from './plbm';
import { CreatePLBMDto } from './dtos/CreatePLBM.dto';

@Controller(Routes.PLBM)
export class PLBMController {
  constructor(@Inject(Services.PLBM) private readonly iService: IPLBMService) {}

  @Post('create')
  async create(@Body() CreateDto: CreatePLBMDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangLoaiBieuMau[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangLoaiBieuMau> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editPLBM,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangLoaiBieuMau[]> {
    return this.iService.delete(idDelete);
  }
}
