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
import { BangChinhSach } from 'src/utils/typeorm';
import { editChinhSach } from 'src/utils/types';
import { IChinhSachService } from './chinhsach';
import { CreateChinhSach } from './dtos/CreateCS.dto';

@Controller(Routes.CS)
export class ChinhSachController {
  constructor(
    @Inject(Services.CS) private readonly iService: IChinhSachService,
  ) {}

  @Post('create')
  async create(@Body() CreateDto: CreateChinhSach): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangChinhSach[]> {
    return this.iService.getAll();
  }

  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangChinhSach> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editChinhSach,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangChinhSach[]> {
    return this.iService.delete(idDelete);
  }
}
