import { BangPhanLoaiHo, BangTinh } from '../utils/typeorm';
import { CreatePLHoDetails, editHo } from '../utils/types';

export interface IPLHoService {
  create(createDetail: CreatePLHoDetails): Promise<any>;
  findById(id: number): Promise<BangPhanLoaiHo>;
  edit(id: number, editParam: editHo): Promise<BangPhanLoaiHo>;
  getAll(): Promise<BangPhanLoaiHo[]>;
  delete(id: number[]): Promise<BangPhanLoaiHo[]>;
}
