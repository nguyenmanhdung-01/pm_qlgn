import { Controller, Inject, Get } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IKhuVucRaSoat } from './khu-vuc-ra-soat';

@Controller(Routes.KHUVUCRASOAT)
export class KhuVucRaSoatController {
  constructor(
    @Inject(Services.KHUVUCRASOAT)
    private readonly khuVucRaSoatService: IKhuVucRaSoat,
  ) {}

  @Get('khuVucRaSoat')
  async getAllDotRaSoat() {
    const khuVucRaSoatList =
      await this.khuVucRaSoatService.getAllKhuVucRaSoat();
    return khuVucRaSoatList;
  }
}
