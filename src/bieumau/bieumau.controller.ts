import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Body,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { BangDanhSachBieuMau } from 'src/utils/typeorm';
import { PaginationParams, editBieuMau } from 'src/utils/types';
import { IBieuMauService } from './bieumau';
import { CreateBieuMau } from './dtos/CreateBieuMau.dto';

@Controller(Routes.BIEUMAU)
export class BieuMauController {
  constructor(
    @Inject(Services.BIEUMAU) private readonly iService: IBieuMauService,
  ) {}

  @Post('create')
  async create(@Body() CreateDto: CreateBieuMau): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(
    @Query('search') search: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('orderByParam') orderByParam: string,
    @Query('desc') desc: string,
  ): Promise<any> {
    return this.iService.getAll(search, offset, limit, orderByParam, desc);
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangDanhSachBieuMau> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editBieuMau,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangDanhSachBieuMau[]> {
    return this.iService.delete(idDelete);
  }
}
