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
import { BangDonVi, BangTinh } from 'src/utils/typeorm';
import { editTinh } from 'src/utils/types';
import { CreateTinhDto } from './dtos/CreateTinh.dto';
import { ITinhService } from './tinh';

@Controller(Routes.TINH)
export class TinhController {
  constructor(@Inject(Services.TINH) private readonly iService: ITinhService) {}

  @Post('create')
  async create(@Body() CreateDto: CreateTinhDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangTinh[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangTinh> {
    return this.iService.findById(id);
  }
  @Get('getDonViByID/:id')
  async getDonViByID(
    @Param('id') id: number,
    @Query('search') search: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('orderByParam') orderByParam: string,
    @Query('desc') desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }> {
    return this.iService.findDonViById(
      id,
      search,
      offset,
      limit,
      orderByParam,
      desc,
    );
  }

  @Get('getByIDParent/:id')
  async getByIDParent(@Param('id') id: number): Promise<BangTinh[]> {
    return this.iService.findChildrenByIdParent(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editTinh,
  ): Promise<any> {
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangTinh[]> {
    return this.iService.delete(idDelete);
  }
}
