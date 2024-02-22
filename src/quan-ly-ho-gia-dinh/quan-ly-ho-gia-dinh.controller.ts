import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as xlsx from 'xlsx';

import { FileInterceptor } from '@nestjs/platform-express';
import { Routes, Services } from 'src/utils/constants';
import { IQuanLyHoGiaDinhService } from './quanLyHoGiaDinh';
import { UpdateChuHoDto } from './dtos/updateChuHoGiaDinh.dto';
import {
  BangTenTruongThongTinTVH,
  BangThongTinHo,
  BangTruongThongTinHo,
} from 'src/utils/typeorm';
import { CreateTruongThongTinHoDto } from './dtos/createTenTruongThongTinHo.dto';
import { UpdateTenTruongThongTinDto } from './dtos/updateTenTruongThongTin.dto';
import { SaveChangesMemberDto } from './dtos/saveChangesMember.dto';
@Controller(Routes.QUANLYHOGIADINH)
export class QuanLyHoGiaDinhController {
  constructor(
    @Inject(Services.QUANLYHOGIADINH)
    private readonly quanLyHoGiaDinhService: IQuanLyHoGiaDinhService,
  ) {}

  @Get('/dacDiemHo/:idHoGiaDinh')
  async getDacDiemThongTinHo(
    @Param('idHoGiaDinh') idHoGiaDinh: number,
  ): Promise<BangThongTinHo[]> {
    return this.quanLyHoGiaDinhService.getDacDiemThongTinHo(idHoGiaDinh);
  }

  @Get('/truongThongTinHo')
  async getAllTruongThongTinHo(): Promise<BangTruongThongTinHo[]> {
    return this.quanLyHoGiaDinhService.getAllTruongThongTinHo();
  }

  @Get('/truongTenThongTinHo')
  async getAllTenTruongThongTinHo(): Promise<BangTruongThongTinHo[]> {
    return this.quanLyHoGiaDinhService.getAllTenTruongThongTinHo();
  }

  @Get('/truongThongTinTvHo')
  async getAllTruongThongTinTv(): Promise<BangTenTruongThongTinTVH[]> {
    return this.quanLyHoGiaDinhService.getAllTruongThongTinTV();
  }

  @Get('selectMaTT')
  async getMaTT(): Promise<BangTenTruongThongTinTVH[]> {
    return this.quanLyHoGiaDinhService.selectMaTT();
  }

  @Put('/updateChuHo/:chuHoID')
  @UsePipes(new ValidationPipe({ transform: true })) // Sử dụng ValidationPipe để xác thực DTO
  async updateChuHo(
    @Param('chuHoID') chuHoID: number,
    @Body() updateChuHoDto: UpdateChuHoDto,
  ) {
    return this.quanLyHoGiaDinhService.updateThongTinChuHo(
      chuHoID,
      updateChuHoDto,
    );
  }

  @Post('updateTruongThongTinHo')
  async updateTruongThongTinHo(
    @Body()
    requestBody: {
      updateRequests: {
        id: number;
        fieldName: string;
        value: string;
        NguoiChinhSuaID: number;
      }[];
      removalRequests: [];
    },
  ) {
    const { updateRequests, removalRequests } = requestBody;
    // console.log('removalRequests', removalRequests);

    // Gọi service để thực hiện cập nhật
    return await this.quanLyHoGiaDinhService.updateMultipleGhiChuAndGiaTri(
      updateRequests,
      removalRequests,
    );
  }

  @Put('editTruongThongTinHo')
  async TruongThongTinHo(
    @Body()
    updateRequests: { id: number; fieldName: string; value: string }[],
  ) {
    // Gọi service để thực hiện cập nhật
    return await this.quanLyHoGiaDinhService.updateTruongFamily(updateRequests);
  }

  @Put('updateTruongThongTinTV')
  async updateTruongThongTV(
    @Body()
    updateRequests: {
      id: number;
      fieldName: string;
      value: string;
      NguoiChinhSuaID: number;
    }[],
  ) {
    // Gọi service để thực hiện cập nhật
    return this.quanLyHoGiaDinhService.updateTruongMember(updateRequests);
  }

  @Post('/addTruongThongTinHo')
  async createTruongThongTinHo(
    @Body() createTruongThongTinHoDto: CreateTruongThongTinHoDto,
  ) {
    // console.log('createTruongThongTinHo', createTruongThongTinHoDto);

    const { userId, ...postData } = createTruongThongTinHoDto;
    //console.log('postData', postData);

    return this.quanLyHoGiaDinhService.createTruongThongTinHo(postData, userId);
  }

  @Put(':id/deleteTruongThongTin')
  async markAsRemoved(@Param('id') truongThongTinID: number) {
    // Gọi service để cập nhật trường IsRemoved thành true
    const updated = await this.quanLyHoGiaDinhService.deleteTruongThongTinHo(
      truongThongTinID,
    );

    if (!updated) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${truongThongTinID}`,
      );
    }

    return { message: 'Đã cập nhật trạng thái thành công' };
  }

  @Put(':id/deleteTruongThongTin')
  async deleteTVH(@Param('id') truongThongTinID: number) {
    // Gọi service để cập nhật trường IsRemoved thành true
    const updated = await this.quanLyHoGiaDinhService.deleteTruongThongTinTVH(
      truongThongTinID,
    );

    if (!updated) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${truongThongTinID}`,
      );
    }

    return { message: 'Đã cập nhật trạng thái thành công' };
  }

  @Post('deletes')
  async deleteMultiple(@Body() ids: number[]) {
    //console.log(ids);

    return await this.quanLyHoGiaDinhService.deleteMultiple(ids);
  }

  @Post('deletesTvHo')
  async deleteMultipleTvHo(@Body() ids: number[]) {
    //console.log(ids);

    return await this.quanLyHoGiaDinhService.deleteMultipleTvHo(ids);
  }

  @Post('save-changes-dacdiem/:idHoGiaDinh')
  async saveChangesDacDiemHo(
    @Body() saveChangesDacDiemHo: any,
    @Param('idHoGiaDinh') idHoGiaDinh: number,
  ) {
    // Gọi service để lưu dữ liệu vào database
    const { ...formData } = saveChangesDacDiemHo;
    return this.quanLyHoGiaDinhService.saveChangeDacDiemHo(
      formData,
      idHoGiaDinh,
    );
  }

  @Post('save-changes')
  async saveChanges(@Body() saveChangesDto: any) {
    // Gọi service để lưu dữ liệu vào database
    const { userId, ...formData } = saveChangesDto;
    return this.quanLyHoGiaDinhService.saveChanges(formData, userId);
  }

  @Post('save-changes-TvHo')
  async saveChangesTVHo(@Body() saveChangesMemberDto: SaveChangesMemberDto) {
    // Gọi service để lưu dữ liệu vào database
    return this.quanLyHoGiaDinhService.saveChangesTVHo(saveChangesMemberDto);
  }

  @Put('/updateTenTTT/:id')
  async updateTruongThongTin(
    @Param('id') id: number,
    @Body() updateTruongThongTinDto: UpdateTenTruongThongTinDto,
  ) {
    // Gọi service để thực hiện cập nhật thông tin
    return this.quanLyHoGiaDinhService.updateTruongThongTin(
      id,
      updateTruongThongTinDto,
    );
  }

  @Post('chuHo')
  async createChuHo(@Body() chuHo: any) {
    const result = await this.quanLyHoGiaDinhService.createChuHo(chuHo);
    return result;
  }

  @Get('hoGiaDinh')
  async getAllHoGiaDinh(@Query() queryParams: any) {
    const hoGiaDinhList = await this.quanLyHoGiaDinhService.getAllHoGiaDinh(
      queryParams,
    );
    return hoGiaDinhList;
  }

  @Get('hoGiaDinh/:HoGiaDinhID')
  async getDetailHoGiaDinh(
    @Param('HoGiaDinhID', ParseIntPipe) HoGiaDinhID: number,
  ) {
    const hoGiaDinhDetail =
      await this.quanLyHoGiaDinhService.getDetailHoGiaDinh(HoGiaDinhID);
    return hoGiaDinhDetail;
  }

  @Post('hoGiaDinh')
  async createHoGiaDinh(@Body() hoGiaDinhDetails: any) {
    const savedHoGiaDinh = await this.quanLyHoGiaDinhService.createHoGiaDinh(
      hoGiaDinhDetails,
    );
    return savedHoGiaDinh;
  }

  @Post('hoGiaDinh/uploadExcel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(@UploadedFile() file: Express.Multer.File) {
    const results = await this.quanLyHoGiaDinhService.processExcelFile(file);
    return results;
  }

  @Put('hoGiaDinh')
  async editHoGiaDinh(@Body() hoGiaDinhEdit: any) {
    const updateHoGiaDinh = await this.quanLyHoGiaDinhService.editHoGiaDinh(
      hoGiaDinhEdit,
    );
    return updateHoGiaDinh;
  }

  @Put('hoGiaDinh/baBang')
  async editHoGiaDinhAndChuHoAndThanhVienHo(@Body() dataEdit: any) {
    const result =
      await this.quanLyHoGiaDinhService.editHoGiaDinhAndChuHoAndThanhVienHo(
        dataEdit,
      );
    return result;
  }

  @Delete('hoGiaDinhDetail')
  async deleteOneHoGiaDinh(@Body() HoGiaDinhID: any) {
    const result = await this.quanLyHoGiaDinhService.deleteOneHoGiaDinh(
      HoGiaDinhID,
    );
    return result;
  }

  @Delete('hoGiaDinh')
  async deleteManyHoGiaDinh(@Body() idHoGiaDinh: number[]) {
    const result = await this.quanLyHoGiaDinhService.deleteManyHoGiaDinh(
      idHoGiaDinh,
    );
    return result;
  }

  @Post('danhSachDieuTra')
  async createDanhSachRaSoat(@Body() danhSachDieuTra: any) {
    const saved = await this.quanLyHoGiaDinhService.createDanhSachRaSoat(
      danhSachDieuTra,
    );
    return saved;
  }

  @Get('getDacDiemHo/:hoGiaDinhId')
  async getData(
    @Param('hoGiaDinhId') hoGiaDinhId: number,
    @Query('time') time?: string, // Lấy thời gian từ query parameter
  ) {
    try {
      const data = await this.quanLyHoGiaDinhService.getDataAtTime(
        hoGiaDinhId,
        time,
      );
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('getAllKey/:hoGiaDinhId')
  async getAllKey(@Param('hoGiaDinhId') hoGiaDinhId: number) {
    try {
      const data = await this.quanLyHoGiaDinhService.getAllKeys(hoGiaDinhId);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('deleteTime/:hoGiaDinhId')
  async deleteDataAtTime(
    @Param('hoGiaDinhId') hoGiaDinhId: number,
    @Query('time') time: string,
  ) {
    return await this.quanLyHoGiaDinhService.deleteDataAtTime(
      hoGiaDinhId,
      time,
    );
  }
}
