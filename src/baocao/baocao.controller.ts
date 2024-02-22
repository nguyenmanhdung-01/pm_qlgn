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
import { IBaoCaoService } from './baocao';
import { BangDanhSachTaiLieu } from 'src/utils/typeorm';

@Controller(Routes.BAOCAO)
export class BaoCaoController {
  constructor(
    @Inject(Services.BAOCAO) private readonly iService: IBaoCaoService,
  ) {}

  @Get('getAll')
  async getAll(
    @Query('search') search: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('orderByParam') orderByParam: string,
    @Query('desc') desc: string,
    @Query('exel') exel: string,
  ): Promise<any> {
    return this.iService.getAll(
      search,
      offset,
      limit,
      orderByParam,
      desc,
      exel,
    );
  }

  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangDanhSachTaiLieu> {
    return this.iService.findById(id);
  }
}
