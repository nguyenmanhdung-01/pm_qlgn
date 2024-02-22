import { BangPhanLoaiTaiLieu } from '../utils/typeorm';
import { CreatePLTLDetails, editPLTL } from '../utils/types';

export interface IPLTLService {
  create(createDetail: CreatePLTLDetails): Promise<any>;
  findById(id: number): Promise<BangPhanLoaiTaiLieu>;
  edit(id: number, editParam: editPLTL): Promise<BangPhanLoaiTaiLieu>;
  getAll(): Promise<BangPhanLoaiTaiLieu[]>;
  delete(id: number[]): Promise<BangPhanLoaiTaiLieu[]>;
}
