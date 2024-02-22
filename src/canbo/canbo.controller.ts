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
import { BangCanBo } from 'src/utils/typeorm';
import { editCanBo, editDonVi, findByID } from 'src/utils/types';
import { ICanBoService } from './canbo';
import { CreateCanBoDto } from './dtos/CreateCanBo.dto';

@Controller(Routes.CB)
export class CanBoController {
  constructor(@Inject(Services.CB) private readonly iService: ICanBoService) {}

  @Post('create')
  async create(@Body() CreateDto: CreateCanBoDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangCanBo[]> {
    return this.iService.getAll();
  }
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangCanBo> {
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
    @Body() editData: editCanBo,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangCanBo[]> {
    return this.iService.delete(idDelete);
  }
}
