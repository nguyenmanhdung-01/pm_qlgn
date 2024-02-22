import { BangChiTieuB2 } from '../utils/typeorm';
import { CreatePhieuB2Details, editB2 } from '../utils/types';

export interface IPB2Service {
  create(createDetail: CreatePhieuB2Details): Promise<any>;
  findById(id: number): Promise<BangChiTieuB2>;
  edit(id: number, editParam: editB2): Promise<BangChiTieuB2>;
  getAll(): Promise<BangChiTieuB2[]>;
  delete(id: number[]): Promise<BangChiTieuB2[]>;
}
