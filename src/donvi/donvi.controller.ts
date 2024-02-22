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
import { BangDonVi } from 'src/utils/typeorm';
import { editDonVi, findByID } from 'src/utils/types';
import { IDonViService } from './donvi';
import { CreateDonViDto } from './dtos/CreateDonVi.dto';

@Controller(Routes.DV)
export class DonViController {
  constructor(@Inject(Services.DV) private readonly iService: IDonViService) {}

  @Post('create')
  async create(@Body() CreateDto: CreateDonViDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(
    @Query('search') search: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('orderByParam') orderByParam: string,
    @Query('desc') desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }> {
    return this.iService.getAll(search, offset, limit, orderByParam, desc);
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangDonVi> {
    return this.iService.findById(id);
  }

  @Get('getByListID')
  async getBYListID(@Body() id: findByID): Promise<any> {
    console.log('id', id);

    return this.iService.findByListID(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editDonVi,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangDonVi[]> {
    return this.iService.delete(idDelete);
  }
}
