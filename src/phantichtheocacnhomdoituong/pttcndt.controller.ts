import {
  Controller,
  Inject,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { IPTTCNDTService } from './pttcndt';
import { CreatePTTCNDTDto } from './dtos/CreatePTTCNDT.dto';
import { BangPhanTichTheoCacNhomDoiTuong } from 'src/utils/typeorm';
@Controller(Routes.PTTCNDT)
export class PTTCNDTController {
  constructor(
    @Inject(Services.PTTCNDT) private readonly iService: IPTTCNDTService,
  ) {}
  @Get('')
  async getAllChart(
    @Query('time') time: any,
    @Query('phanTo') phanTo: any,
    @Query('loaiHo') loaiHo: any,
    @Query('soLuongTiLe') soLuongTiLe: any,
    @Query('thanhThiHayDanhSach') thanhThiHayDanhSach: any,
  ) {
    const result = await this.iService.getAllChart(
      time,
      phanTo,
      loaiHo,
      soLuongTiLe,
      thanhThiHayDanhSach,
    );
    return result;
  }
  @Get('thoiDiem')
  async getAllThoiDiem() {
    const result = await this.iService.getAllThoiDiem();
    return result;
  }

  @Post('create')
  async create(@Body() createDto: CreatePTTCNDTDto): Promise<any> {
    const { date, createDetails } = createDto;

    return this.iService.create(date, createDetails);
  }

  @Get('getAll')
  async getAll(): Promise<BangPhanTichTheoCacNhomDoiTuong[]> {
    return this.iService.getAll();
  }

  @Post('upload/uploadexel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileExel(@UploadedFile() file) {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      console.log('worksheet', worksheet['A4']?.v);
      if (
        worksheet['A4']?.v !== 'TỔNG HỢP KẾT QUẢ RÀ SOÁT HỘ NGHÈO, HỘ CẬN NGHÈO'
      ) {
        return {
          message: 'Chưa chọn đúng file',
        };
      }
      const range = 'A9:M1000'; // Đổi phạm vi bảng cần đọc (ví dụ: từ A2 đến C10)
      const data = xlsx.utils.sheet_to_json(worksheet, { range, header: 'A' });

      const result = data.map((row) => {
        return {
          so_thu_tu: +row['A'] ? +row['A'] : '',
          dia_ban: row['B'],
          phan_to: row['C'],
          to_so_cu_dan: row['D'],
          so_ho_dan_toc_toi_thieu: row['E'],
          tong_so_ho_ngheo: row['F'],
          tong_so_ho_can_ngheo: row['G'],
          ho_ngheo_dan_toc_thieu_so: row['H'],
          ho_can_ngheo_dan_toc_thieu_so: row['I'],
          ho_ngheo_khong_co_kha_nang_lao_dong: row['J'],
          ho_can_ngheo_khong_co_kha_nang_lao_dong: row['K'],
          ho_ngheo_co_cong: row['L'],
          ho_can_ngheo_co_cong: row['M'],
          // ty_le_ho_ngheo: (row['F'] * 100).toFixed(2) + '%',
        };
      });

      // Duyệt qua mảng dữ liệu và cập nhật dia_ban nếu cần

      return result;
    } catch (error) {
      return { message: 'Error reading Excel file' };
    }
  }
}
