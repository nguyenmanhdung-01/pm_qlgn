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
import { BangThietLapNguongPL } from 'src/utils/typeorm';
import { editTLNPL } from 'src/utils/types';
import { ITLNPLService } from './tlnpl';
import { Routes, Services } from 'src/utils/constants';
import { CreateTLNPL } from './dtos/CreateTLNPL.dto';

@Controller(Routes.TLNPL)
export class TLNPLController {
  constructor(
    @Inject(Services.TLNPL) private readonly iService: ITLNPLService,
  ) {}

  @Post('create')
  async create(@Body() CreateDto: CreateTLNPL): Promise<any> {
    return this.iService.create(CreateDto);
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangThietLapNguongPL> {
    return this.iService.findById(id);
  }
  @Get('getAll')
  async getAll(): Promise<BangThietLapNguongPL[]> {
    return this.iService.getAll();
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editTLNPL,
  ): Promise<any> {
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangThietLapNguongPL[]> {
    return this.iService.delete(idDelete);
  }
}
