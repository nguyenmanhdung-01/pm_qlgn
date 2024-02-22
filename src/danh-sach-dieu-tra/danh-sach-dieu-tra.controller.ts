import {
  Controller,
  Inject,
  Get,
  Delete,
  Body,
  Post,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IDanhSachDieuTra } from './danh-sach-dieu-tra';

@Controller(Routes.DANHSACHDIEUTRA)
export class DanhSachDieuTraController {
  constructor(
    @Inject(Services.DANHSACHDIEUTRA)
    private readonly danhSachDieuTraRepository: IDanhSachDieuTra,
  ) {}

  @Get('danhSachDieuTra')
  async getAllDanhSachDieuTra(@Query() queryParams: any) {
    const getListDanhSachDieuTra =
      await this.danhSachDieuTraRepository.getAllDanhSachDieuTra(queryParams);
    return getListDanhSachDieuTra;
  }

  @Get('danhSachDieuTraTheoDot/:DotRaSoatID')
  async getDanhSachTaiLieuTheoDot(@Param('DotRaSoatID') DotRaSoatID) {
    const result =
      await this.danhSachDieuTraRepository.getDanhSachTaiLieuTheoDot(
        DotRaSoatID,
      );
    return result;
  }

  @Get('danhSachDieuTraHoanThanh/:DotRaSoatID')
  async getDanhSachHoGdheoDot(@Param('DotRaSoatID') DotRaSoatID) {
    const result =
      await this.danhSachDieuTraRepository.getDanhSachHoByDotRaSoatID(
        DotRaSoatID,
      );
    return result;
  }

  @Get('danhSachDieuTra/:DanhSachID')
  async getDetailDanhSachDieuTra(@Param('DanhSachID') DanhSachID) {
    const result =
      await this.danhSachDieuTraRepository.getDetailDanhSachDieuTra(DanhSachID);
    return result;
  }

  @Get('danhSachDieuTraByID/:DanhSachID')
  async getDanhSachDieuTraByID(@Param('DanhSachID') DanhSachID) {
    const result = await this.danhSachDieuTraRepository.getDanhSachDieuTraByID(
      DanhSachID,
    );
    return result;
  }

  @Get('phanLoaiHo/:DanhSachID')
  async getPhanLoaiHo(@Param('DanhSachID') DanhSachID) {
    // console.log('DanhSachID: ', DanhSachID);

    const result = await this.danhSachDieuTraRepository.getPhanLoaiHo(
      DanhSachID,
    );
    return result;
  }

  @Post('danhSachDieuTra')
  async createDanhSachDieuTra(@Body() danhSachDieuTra) {
    const result = await this.danhSachDieuTraRepository.createDanhSachDieuTra(
      danhSachDieuTra,
    );
    return result;
  }

  @Put('danhSachDieuTraEdit')
  async editDanhSachDieuTra(@Body() editDanhSachDieuTra) {
    const result = await this.danhSachDieuTraRepository.editDanhSachDieuTra(
      editDanhSachDieuTra,
    );
    return result;
  }

  @Put('danhSachDieuTraEdit/Status')
  async updateStatusDanhSachDieuTra(@Body() danhSachDieuTraEditStatus) {
    const result =
      await this.danhSachDieuTraRepository.updateStatusDanhSachDieuTra(
        danhSachDieuTraEditStatus,
      );
    return result;
  }

  @Put('danhSachDieuTra/danhSachHo')
  async updateDanhSachHoTrongDanhSachDieuTra(@Body() dataDanhSach) {
    const result =
      await this.danhSachDieuTraRepository.updateDanhSachHoTrongDanhSachDieuTra(
        dataDanhSach,
      );
    return result;
  }

  @Put('danhSachDieuTra/danhSachTaiLieu')
  async updateDanhSachTaiLieuTrongDanhSachDieuTra(@Body() dataDanhSach) {
    const result =
      await this.danhSachDieuTraRepository.updateDanhSachTaiLieuTrongDanhSachDieuTra(
        dataDanhSach,
      );
    return result;
  }

  @Delete('danhSachDieuTra/danhSachHo')
  async deleteDanhSachHoTrongDanhSachDieuTra(@Body() Data) {
    const result =
      await this.danhSachDieuTraRepository.deleteDanhSachHoTrongDanhSachDieuTra(
        Data.DanhSachID,
        Data.DanhSachHo,
      );
    return result;
  }

  @Delete('danhSachDieuTraDetail')
  async deleteOneDanhSachDieuTra(@Body() DanhSachID: number) {
    const result =
      await this.danhSachDieuTraRepository.deleteOneDanhSachDieuTra(DanhSachID);
    return result;
  }

  @Delete('danhSachDieuTra')
  async deleteManyDotRaSoat(@Body() DanhSachIds: number[]) {
    const result =
      await this.danhSachDieuTraRepository.deleteManyDanhSachDieuTra(
        DanhSachIds,
      );
    return result;
  }

  @Get('/statusRaSoat')
  async getStatusRaSoat() {
    const result = await this.danhSachDieuTraRepository.getStatusDotRaSoat();
    return result;
  }
}
