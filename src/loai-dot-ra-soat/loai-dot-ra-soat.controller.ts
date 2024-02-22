import { Controller, Inject, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { ILoaiDotRaSoat } from './loai-dot-ra-soat';

@Controller(Routes.LOAIDOTRASOAT)
export class LoaiDotRaSoatController {
  constructor(
    @Inject(Services.LOAIDOTRASOAT)
    private readonly loaiDotRaSoatService: ILoaiDotRaSoat,
  ) {}

  @Get('loaiDotRaSoat')
  async getAllLoaiDotRaSoat() {
    const loaiDotRaSoatList =
      await this.loaiDotRaSoatService.getAllLoaiDotRaSoat();
    return loaiDotRaSoatList;
  }

  @Get('loaiDotRaSoat/:LoaiDotRaSoatID')
  async getOneLoaiDotRaSoat(
    @Param('LoaiDotRaSoatID', ParseIntPipe) LoaiDotRaSoatID: number,
  ) {
    const result = await this.loaiDotRaSoatService.getOneLoaiDotRaSoat(
      LoaiDotRaSoatID,
    );
    return result;
  }
}
