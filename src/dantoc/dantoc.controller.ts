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
import { IDanTocService } from './dantoc';
import { BangDanToc } from 'src/utils/typeorm';
import { editDanToc } from 'src/utils/types';
import { CreateDanTocDto } from './dtos/CreateDanToc.dto';

@Controller(Routes.DANTOC)
export class DanTocController {
  constructor(
    @Inject(Services.DANTOC) private readonly iService: IDanTocService,
  ) {}

  @Post('create')
  async createDanToc(
    @Body() CreateDanTocDto: CreateDanTocDto,
  ): Promise<BangDanToc> {
    return this.iService.createDanToc(CreateDanTocDto);
  }
  // @Get(':id')
  // async getUserByName(@Param('id') id: number): Promise<BangDanToc> {
  //   return this.iService.findById(id);
  // }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangDanToc> {
    return this.iService.findById(id);
  }

  @Get('getAll')
  async getAllDanToc(): Promise<BangDanToc[]> {
    return this.iService.getAllDanToc();
  }

  @Put('edit/:id')
  async editDanToc(
    @Param('id') idDanToc: number,
    @Body() editDanToc: editDanToc,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.editDanToc(idDanToc, editDanToc);
  }

  @Delete('delete')
  async deleteDanToc(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangDanToc[]> {
    return this.iService.deleteDanToc(idDelete);
  }
}
