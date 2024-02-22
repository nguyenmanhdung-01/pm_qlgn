import { Controller, Inject, Post, Body, Param, Get } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IPhanLoaiHo } from './lich-su-phan-loai-ho';
import { createHistoryHo } from './dtos/createHistoryHo.dto';

@Controller(Routes.LSPLH)
export class LichSuPhanLoaiHoController {
  constructor(
    @Inject(Services.LSPLH)
    private readonly LsHService: IPhanLoaiHo,
  ) {}

  @Post('createHistory')
  async createHistory(@Body() createHistoryDto: createHistoryHo) {
    return this.LsHService.createHistory(createHistoryDto);
  }

  @Get('/historyHo/:DanhSachID')
  async getHistoryHo(@Param('DanhSachID') DanhSachID: number) {
    return await this.LsHService.getPhanLoaiDS(DanhSachID);
  }

  @Post('updateAfterPlh')
  async updateEntities(@Body() dataArray: any[]) {
    try {
      await this.LsHService.updateAfterPlHo(dataArray);
    } catch (error) {
      // Xử lý lỗi tùy theo yêu cầu của bạn
      console.error(error);
    }
  }
}
