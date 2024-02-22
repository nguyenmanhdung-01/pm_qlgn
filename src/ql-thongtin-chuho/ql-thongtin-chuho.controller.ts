import { Controller, Get, Inject, Param } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IQlTTChuHo } from './ql-thongtin-chuho';
import { BangThongTinChuHo } from 'src/utils/typeorm';

@Controller(Routes.TTCHUHO)
export class QlThongtinChuhoController {
  constructor(
    @Inject(Services.TTCHUHO)
    private readonly quanLyTTChuHoService: IQlTTChuHo,
  ) {}

  @Get('/chuHo/:idHoGiaDinh')
  async getChuHoById(@Param('idHoGiaDinh') idHoGiaDinh: number) {
    return this.quanLyTTChuHoService.getChuHoById(idHoGiaDinh);
  }

  @Get('/thongTinChuHo/:idHoGiaDinh')
  async getOneChuHoByIDHoGiaDinh(
    @Param('idHoGiaDinh') idHoGiaDinh: number,
  ): Promise<BangThongTinChuHo> {
    return this.quanLyTTChuHoService.getOneChuHoByIDHoGiaDinh(idHoGiaDinh);
  }
}
