import {
  Controller,
  Inject,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IDotRaSoat } from './dot-ra-soat';

@Controller(Routes.DOTRASOAT)
export class DotRaSoatController {
  constructor(
    @Inject(Services.DOTRASOAT) private readonly dotRaSoatService: IDotRaSoat,
  ) {}

  @Get('dotRaSoat')
  async getAllDotRaSoat(@Query() queryParams: any) {
    const hoGiaDinhList = await this.dotRaSoatService.getAllDotRaSoat(
      queryParams,
    );
    return hoGiaDinhList;
  }
  @Get('dotRaSoatNoQuery')
  async getDotRaSoatNoQuery() {
    const result = await this.dotRaSoatService.getDotRaSoatNoQuery();
    return result;
  }

  @Get('dotRaSoat/:DotRaSoatID')
  async getOneDotRaSoat(@Param('DotRaSoatID') DotRaSoatID) {
    const hoGiaDinhList = await this.dotRaSoatService.getOneDotRaSoat(
      DotRaSoatID,
    );
    return hoGiaDinhList;
  }

  @Get('/statusRaSoat')
  async getStatusRaSoat() {
    const result = await this.dotRaSoatService.getStatusDotRaSoat();
    return result;
  }

  @Post('dotRaSoat')
  async createDotRaSoat(@Body() dotRaSoat: any) {
    const dotRaSoatSaved = await this.dotRaSoatService.createDotRaSoat(
      dotRaSoat,
    );
    return dotRaSoatSaved;
  }

  @Post('mappingDotRaSoatTaiLieu')
  async createTaiLieuTrongDotRaSoat(@Body() dotRaSoatTaiLieu) {
    const result = await this.dotRaSoatService.createTaiLieuTrongDotRaSoat(
      dotRaSoatTaiLieu.idDotRaSoat,
      dotRaSoatTaiLieu.idTaiLieu,
    );
    return result;
  }

  @Put('dotRaSoat')
  async editDotRaSoat(@Body() dotRaSoat: any) {
    const editDotRaSoat = await this.dotRaSoatService.editDotRaSoat(dotRaSoat);
    return editDotRaSoat;
  }

  @Put('dotRaSoat/Status')
  async updateStatusDanhSachDieuTra(@Body() dotRaSoatStatus) {
    const result = await this.dotRaSoatService.updateStatusDotRaSoat(
      dotRaSoatStatus,
    );
    return result;
  }

  @Delete('dotRaSoatDetail')
  async deleteOneDotRaSoat(@Body() DotRaSoatID: number) {
    const result = await this.dotRaSoatService.deleteOneDotRaSoat(DotRaSoatID);
    return result;
  }

  @Delete('dotRaSoat')
  async deleteManyDotRaSoat(@Body() DotRaSoatIDs: number[]) {
    const result = await this.dotRaSoatService.deleteManyDotRaSoat(
      DotRaSoatIDs,
    );
    return result;
  }
}
