import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IQuanLyThanhVien } from './ql-thanh-vien';
import { CreateMemberDto } from './dtos/createMember.dto';
import { BangThongTinThanhVienHo } from 'src/utils/typeorm';
import { UpdateMemberDto } from './dtos/updateMember.dto';

@Controller(Routes.QUANLYTHANHVIEN)
export class QlThanhVienController {
  constructor(
    @Inject(Services.QUANLYTHANHVIEN)
    private readonly quanlyThanhVienService: IQuanLyThanhVien,
  ) {}

  @Post('createThanhVien')
  createThanhVien(@Body(new ValidationPipe()) createMemberDto: any) {
    const { DanTocID, HoGiaDinhID, ...formData } = createMemberDto;
    return this.quanlyThanhVienService.createThanhVien(
      formData,
      DanTocID,
      HoGiaDinhID,
    );
  }

  @Get('getAllTv/:hoGD')
  async getAllTaiLieu(
    @Param('hoGD') hoGD: number,
  ): Promise<BangThongTinThanhVienHo[]> {
    return this.quanlyThanhVienService.getAllThanhVien(hoGD);
  }

  @Get('getThanhVien/:id')
  async getThanhVienById(
    @Param('id') id: number,
  ): Promise<BangThongTinThanhVienHo> {
    const thanhVien = await this.quanlyThanhVienService.getThanhVienByID(id);
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thông tin thành viên.');
    }
    return thanhVien;
  }

  @Get('/:idTV/ddtv')
  async getDacDiemTV(
    @Param('idTV') idTV: number,
    @Query('timeTv') time?: string,
  ) {
    try {
      const data = await this.quanlyThanhVienService.getSelectDacDiem(
        idTV,
        time,
      );
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('getAllKey/:idTV')
  async getAllKey(@Param('idTV') idTV: number) {
    try {
      const data = await this.quanlyThanhVienService.getAllKeysTime(idTV);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('deletes')
  async deleteMultiple(@Body() ids: number[]) {
    //console.log(ids);

    return await this.quanlyThanhVienService.deleteMultiple(ids);
  }

  @Put('/updateMember/:memberId')
  async updateChuHo(
    @Param('memberId') memberID: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.quanlyThanhVienService.editMember(memberID, updateMemberDto);
  }

  @Put(':id/deleteTV')
  async markAsRemoved(@Param('id') truongThongTinID: number) {
    // Gọi service để cập nhật trường IsRemoved thành true
    const updated = await this.quanlyThanhVienService.deleteTruongTTTV(
      truongThongTinID,
    );

    if (!updated) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${truongThongTinID}`,
      );
    }

    return { message: 'Đã cập nhật trạng thái thành công' };
  }

  @Delete('deleteTime/:TvID')
  async deleteDataAtTime(
    @Param('TvID') TvID: number,
    @Query('timeTv') time: string,
  ) {
    return await this.quanlyThanhVienService.deleteDataAtTime(TvID, time);
  }
}
