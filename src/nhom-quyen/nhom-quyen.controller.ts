import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { INhomQuyen } from './nhom-quyen';

@Controller(Routes.NHOMQUYEN)
export class NhomQuyenController {
  constructor(
    @Inject(Services.NHOMQUYEN) private readonly nhomQuyenService: INhomQuyen,
  ) {}

  @Get('')
  async getAllNhomQuyen(@Query('search') search: any) {
    const result = await this.nhomQuyenService.getAllNhomQuyen(search);
    return result;
  }

  @Get('/:idNhomQuyen')
  async getDetailNhomQuyen(@Param('idNhomQuyen') idNhomQuyen) {
    const result = await this.nhomQuyenService.getDetailNhomQuyen(idNhomQuyen);
    return result;
  }

  @Post('')
  async createNhomQuyen(@Body() dataNhomQuyen) {
    const result = await this.nhomQuyenService.createNhomQuyen(dataNhomQuyen);
    return result;
  }

  @Put('')
  async updateNhomQuyen(@Body() dataNhomQuyenEdit) {
    const result = await this.nhomQuyenService.updateNhomQuyen(
      dataNhomQuyenEdit,
    );
    return result;
  }

  @Delete('')
  async deleteOneNhomQuyen(@Body() RoleGroupID: number) {
    const result = await this.nhomQuyenService.deleteOneNhomQuyen(RoleGroupID);
    return result;
  }

  @Delete('many')
  async deleteManyNhomQuyen(@Body() RoleGroupIDs: number[]) {
    const result = await this.nhomQuyenService.deleteManyNhomQuyen(
      RoleGroupIDs,
    );
    return result;
  }

  @Post('copyNhomQuyen')
  async copyNhomQuyen(@Body() RoleGroupIDs: number[]) {
    const result = await this.nhomQuyenService.copyNhomQuyen(RoleGroupIDs);
    return result;
  }
}
