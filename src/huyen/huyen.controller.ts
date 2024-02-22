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
import { BangHuyen, BangTinh } from 'src/utils/typeorm';
import { editHuyen, editTinh } from 'src/utils/types';
import { CreateHuyenDto } from './dtos/CreateHuyen.dto';
import { IHuyenService } from './huyen';

@Controller(Routes.HUYEN)
export class HuyenController {
  constructor(
    @Inject(Services.HUYEN) private readonly iService: IHuyenService,
  ) {}

  @Post('create')
  async create(@Body() CreateDto: CreateHuyenDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangHuyen[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangHuyen> {
    return this.iService.findById(id);
  }

  @Get('getByIDParent/:id')
  async getByIDParent(@Param('id') id: number): Promise<BangHuyen[]> {
    return this.iService.findChildrenByIdParent(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editHuyen,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangHuyen[]> {
    return this.iService.delete(idDelete);
  }
}
