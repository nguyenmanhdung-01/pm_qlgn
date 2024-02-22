import { Controller, Inject, Get } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IPhanLoaiTaiLieu } from './phan-loai-tai-lieu';

@Controller(Routes.LOAITAILIEU)
export class PhanLoaiTaiLieuController {
  constructor(
    @Inject(Services.LOAITAILIEU)
    private readonly loaiTaiLieuService: IPhanLoaiTaiLieu,
  ) {}

  @Get('loaiTaiLieu')
  async getAllLoaiTaiLi() {
    const loaiTaiLieuList = await this.loaiTaiLieuService.getAllLoaiTaiLieu();
    return loaiTaiLieuList;
  }
}
