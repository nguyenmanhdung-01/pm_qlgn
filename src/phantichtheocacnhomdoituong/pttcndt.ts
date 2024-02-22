import { BangPhanTichTheoCacNhomDoiTuong } from 'src/utils/typeorm';
import { CreatePTTCNDTDetails } from '../utils/types';

export interface IPTTCNDTService {
  create(date: Date, createDetail: CreatePTTCNDTDetails[]): Promise<any>;
  getAllThoiDiem();
  getAllChart(
    time: any,
    phanTo: any,
    loaiHo: any,
    soLuongTiLe: any,
    thanhThiHayDanhSach: any,
  );
  delete(id: number[]): Promise<BangPhanTichTheoCacNhomDoiTuong[]>;
  getAll(): Promise<BangPhanTichTheoCacNhomDoiTuong[]>;
}
