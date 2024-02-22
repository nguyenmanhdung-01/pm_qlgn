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
import { BangDonVi, BangVung } from 'src/utils/typeorm';
import { editVung } from 'src/utils/types';
import { CreateVungDto } from './dtos/CreateVung.dto';
import { IVungService } from './vung';

@Controller(Routes.VUNG)
export class VungController {
  constructor(@Inject(Services.VUNG) private readonly iService: IVungService) {}

  @Post('create')
  async create(@Body() CreateVungDto: CreateVungDto): Promise<BangVung> {
    return this.iService.createVung(CreateVungDto);
  }

  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangVung> {
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

  @Get('getAll')
  async getAll(): Promise<BangVung[]> {
    return this.iService.getAllVung();
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editVung: editVung,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.editVung(id, editVung);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangVung[]> {
    return this.iService.deleteVung(idDelete);
  }
}
