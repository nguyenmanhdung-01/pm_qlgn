import { Controller, Get, Inject, Query, Post, Body } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IQuanLyHoGiaDinhHLService } from './quanLyHoGiaDinhHL';

@Controller(Routes.QUANLYHOGIADINHHL)
export class QuanLyHoGiaDinhHlController {
  constructor(
    @Inject(Services.QUANLYHOGIADINHHL)
    private readonly quanLyHoGiaDinhHlService: IQuanLyHoGiaDinhHLService,
  ) {}
  @Get('danhSachXa')
  async getDanhSachHoNgheoCanNgheoByHuyen(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('HuyenID') HuyenID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getDanhSachHoNgheoCanNgheoByHuyen(
        DotRaSoatID,
        LoaiTaiLieuID,
        HuyenID,
      );
    return result;
  }

  @Get('danhSachThon')
  async getDanhSachHoNgheoCanNgheoByXa(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('XaID') XaID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getDanhSachHoNgheoCanNgheoByXa(
        DotRaSoatID,
        LoaiTaiLieuID,
        XaID,
      );
    return result;
  }

  @Get('danTocThon')
  async getDanTocHoNgheoCanNgheoByXa(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('XaID') XaID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getDanTocHoNgheoCanNgheoByXa(
        DotRaSoatID,
        LoaiTaiLieuID,
        XaID,
      );
    return result;
  }
  @Get('danTocXa')
  async getDanTocHoNgheoCanNgheoByHuyen(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('HuyenID') HuyenID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getDanTocHoNgheoCanNgheoByHuyen(
        DotRaSoatID,
        LoaiTaiLieuID,
        HuyenID,
      );
    return result;
  }

  @Get('nguyenNhanNgheoThon')
  async getNguyenNhanNgheoHoNgheoCanNgheoByXa(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('XaID') XaID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getNguyenNhanNgheoHoNgheoCanNgheoByXa(
        DotRaSoatID,
        LoaiTaiLieuID,
        XaID,
      );
    return result;
  }

  @Get('nguyenNhanNgheoXa')
  async getNguyenNhanNgheoHoNgheoCanNgheoByHuyen(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('HuyenID') HuyenID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getNguyenNhanNgheoHoNgheoCanNgheoByHuyen(
        DotRaSoatID,
        LoaiTaiLieuID,
        HuyenID,
      );
    return result;
  }

  @Get('danTocThonV1')
  async getDanTocHoNgheoCanNgheoByXaV1(
    @Query('DotRaSoatID') DotRaSoatID: any,
    @Query('LoaiTaiLieuID') LoaiTaiLieuID: any,
    @Query('XaID') XaID: any,
  ) {
    const result =
      await this.quanLyHoGiaDinhHlService.getDanTocHoNgheoCanNgheoByXaV1(
        DotRaSoatID,
        LoaiTaiLieuID,
        XaID,
      );
    return result;
  }

  @Post('')
  async exportDanhSach8(@Body() data: any) {
    const result = await this.quanLyHoGiaDinhHlService.exportDanhSach8(data);
    return result;
  }

  @Post('danhSach16')
  async exportDanhSach16(@Body() data: any) {
    const result = await this.quanLyHoGiaDinhHlService.exportDanhSach16(data);
    return result;
  }

  @Post('danhSach17')
  async exportDanhSach17(@Body() data: any) {
    const result = await this.quanLyHoGiaDinhHlService.exportDanhSach17(data);
    return result;
  }
}
