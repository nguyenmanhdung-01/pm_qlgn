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
import { BangXa } from 'src/utils/typeorm';
import { editXa } from 'src/utils/types';
import { IXaService } from './xa';
import { CreateXaDto } from './dtos/CreateXa.dto';

@Controller(Routes.XA)
export class XAController {
  constructor(@Inject(Services.XA) private readonly iService: IXaService) {}

  @Post('create')
  async create(@Body() CreateDto: CreateXaDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangXa[]> {
    return this.iService.getAll();
  }

  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangXa> {
    return this.iService.findById(id);
  }

  @Get('getByIDParent/:id')
  async getByIDParent(@Param('id') id: number): Promise<BangXa[]> {
    return this.iService.findChildrenByIdParent(id);
  }

  @Put('edit/:id')
  async edit(@Param('id') id: number, @Body() editData: editXa): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangXa[]> {
    return this.iService.delete(idDelete);
  }
}
