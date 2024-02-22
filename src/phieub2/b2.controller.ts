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
import { BangChiTieuB2 } from 'src/utils/typeorm';
import { editB2 } from 'src/utils/types';
import { CreatePhieuB2Dto } from './dtos/CreatePhieuB2.dto';
import { IPB2Service } from './b2';

@Controller(Routes.B2)
export class B2Controller {
  constructor(@Inject(Services.B2) private readonly iService: IPB2Service) {}

  @Post('create')
  async create(@Body() CreateDto: CreatePhieuB2Dto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangChiTieuB2[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangChiTieuB2> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(@Param('id') id: number, @Body() editData: editB2): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangChiTieuB2[]> {
    return this.iService.delete(idDelete);
  }
}
