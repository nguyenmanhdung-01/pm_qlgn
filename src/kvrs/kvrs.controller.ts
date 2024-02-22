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
import { BangDotRaSoat, BangKhuVucRaSoat } from 'src/utils/typeorm';
import { editKVRS } from 'src/utils/types';
import { IKVRSService } from './kvrs';
import { CreateKVRSDto } from './dtos/CreateKVRS.dto';

@Controller(Routes.KVRS)
export class KVRSoController {
  constructor(@Inject(Services.KVRS) private readonly iService: IKVRSService) {}

  @Post('create')
  async create(@Body() CreateDto: CreateKVRSDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangKhuVucRaSoat[]> {
    return this.iService.getAll();
  }
  @Get('getAllDRS')
  async getAllDRS(): Promise<BangDotRaSoat[]> {
    return this.iService.getAllDRS();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangKhuVucRaSoat> {
    return this.iService.findById(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editKVRS,
  ): Promise<any> {
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangKhuVucRaSoat[]> {
    return this.iService.delete(idDelete);
  }
}
