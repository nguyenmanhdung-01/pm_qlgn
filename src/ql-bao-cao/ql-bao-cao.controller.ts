import {
  Controller,
  Inject,
  Body,
  Post,
  Get,
  Put,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IQuanLyBaoCao } from './ql-bao-cao';
import { BangDanhSachBaoCao } from 'src/utils/typeorm';
// import { IQuanLyBaoCao } from './ql-bao-cao';

@Controller(Routes.QUANLYBAOCAO)
export class QlBaoCaoController {
  constructor(
    @Inject(Services.QUANLYBAOCAO)
    private readonly quanlyBaoCaoService: IQuanLyBaoCao,
  ) {}

  @Post('danhSachBaoCao')
  async createDotRaSoat(@Body() danhSachTaiLieuDetail: any) {
    const dotRaSoatSaved = await this.quanlyBaoCaoService.createDanhSachBaoCao(
      danhSachTaiLieuDetail,
    );
    return dotRaSoatSaved;
  }

  @Get('/allBC')
  async getAllBaoCao(): Promise<BangDanhSachBaoCao[]> {
    return this.quanlyBaoCaoService.getAllBaoCao();
  }

  @Put(':id/deleteTaiLieu')
  async markAsRemoved(@Param('id') baoCaoID: number) {
    // Gọi service để cập nhật trường IsRemoved thành true
    const updated = await this.quanlyBaoCaoService.deleteBaoCaoID(baoCaoID);

    if (!updated) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${baoCaoID}`,
      );
    }

    return { message: 'Đã cập nhật trạng thái thành công' };
  }

  @Get('getBaoCaoID/:id')
  async getBaoCao(@Param('id') id: number): Promise<BangDanhSachBaoCao> {
    return await this.quanlyBaoCaoService.getBaoCao(id);
  }
}
