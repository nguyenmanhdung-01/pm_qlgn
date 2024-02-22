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
import { BangThon } from 'src/utils/typeorm';
import { editThon } from 'src/utils/types';
import { IThonService } from './thon';
import { CreateThonDto } from './dtos/CreateThon.dto';

@Controller(Routes.THON)
export class ThonController {
  constructor(@Inject(Services.THON) private readonly iService: IThonService) {}

  @Post('create')
  async create(@Body() CreateDto: CreateThonDto): Promise<any> {
    return this.iService.create(CreateDto);
  }

  @Get('getAll')
  async getAll(): Promise<BangThon[]> {
    return this.iService.getAll();
  }

  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangThon> {
    return this.iService.findById(id);
  }

  @Get('getByIDParent/:id')
  async getByIDParent(@Param('id') id: number): Promise<BangThon[]> {
    return this.iService.findChildrenByIdParent(id);
  }

  @Put('edit/:id')
  async edit(
    @Param('id') id: number,
    @Body() editData: editThon,
  ): Promise<any> {
    console.log('xxx');
    return this.iService.edit(id, editData);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangThon[]> {
    return this.iService.delete(idDelete);
  }
}
