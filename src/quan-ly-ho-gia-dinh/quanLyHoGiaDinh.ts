import {
  BangTenTruongThongTinTVH,
  BangThongTinChuHo,
  BangThongTinHo,
  BangTruongThongTinHo,
} from 'src/utils/typeorm';
import { UpdateChuHoDto } from './dtos/updateChuHoGiaDinh.dto';
import { CreateTruongThongTinHoDto } from './dtos/createTenTruongThongTinHo.dto';
import { SaveChangesDto } from './dtos/saveChanges.dto';
import { UpdateTenTruongThongTinDto } from './dtos/updateTenTruongThongTin.dto';
import { SaveChangesMemberDto } from './dtos/saveChangesMember.dto';
import { SaveChangesDacDiemHoDto } from './dtos/saveChangeDacDiemHo.dto';

export interface IQuanLyHoGiaDinhService {
  updateThongTinChuHo(
    chuHoID: number,
    updateChuHoDto: UpdateChuHoDto,
  ): Promise<BangThongTinChuHo>;

  getDacDiemThongTinHo(HoGiaDinhID: number): Promise<BangThongTinHo[]>;
  getAllTenTruongThongTinHo(): Promise<BangTruongThongTinHo[]>;
  getAllTruongThongTinTV(): Promise<BangTenTruongThongTinTVH[]>;
  getAllTruongThongTinHo(): Promise<BangTruongThongTinHo[]>;
  createTruongThongTinHo(
    createTruongThongTinHoDto: CreateTruongThongTinHoDto,
    userId: number,
  ): Promise<BangTruongThongTinHo>;

  deleteMultiple(ids: number[]);
  deleteMultipleTvHo(ids: number[]);
  deleteTruongThongTinHo(truongThongTinID: number);

  saveChanges(saveChangesDto: SaveChangesDto, userId: number);
  saveChangesTVHo(saveChangesMemberDto: SaveChangesMemberDto);
  saveChangeDacDiemHo(
    saveChangesDto: SaveChangesDacDiemHoDto,
    HoGiaDinhID: number,
  );
  updateTruongThongTin(
    id: number,
    updateTruongThongTinDto: UpdateTenTruongThongTinDto,
  );

  updateMultipleGhiChuAndGiaTri(
    updateRequests: {
      id: number;
      fieldName: string;
      value: string;
      NguoiChinhSuaID: number;
    }[],
    removalRequests: [],
  ): Promise<BangTruongThongTinHo>;

  updateTruongMember(
    updateRequests: {
      id: number;
      fieldName: string;
      value: string;
      NguoiChinhSuaID: number;
    }[],
  ): Promise<BangTenTruongThongTinTVH>;

  updateTruongFamily(
    updateRequests: { id: number; fieldName: string; value: string }[],
  ): Promise<BangTruongThongTinHo[]>;

  selectMaTT(): Promise<BangTenTruongThongTinTVH[]>;
  deleteTruongThongTinTVH(truongThongTinID: number): Promise<boolean>;
  createChuHo(chuHo: any);
  createHoGiaDinh(hoGiaDinhDetails: any);
  getAllHoGiaDinh(queryParams: any);
  getDetailHoGiaDinh(HoGiaDinhID: number);
  editHoGiaDinh(hoGiaDinhEdit: any);
  deleteOneHoGiaDinh(HoGiaDinhID: number);
  deleteManyHoGiaDinh(idHoGiaDinhs: number[]);
  createDanhSachRaSoat(dataDanhSachRaSoat: any);
  getDataAtTime(hoGiaDinhId: number, time?: string);
  getAllKeys(hoGiaDinhId: number);
  deleteDataAtTime(hoGiaDinhId: number, time: string);
  processExcelFile(file: any);
  editHoGiaDinhAndChuHoAndThanhVienHo(dataEdit: any);
}
