import { BangChiTieuB1 } from '../utils/typeorm';
import { CreatePhieuB1Details, editB1 } from '../utils/types';

export interface IPB1Service {
  create(createDetail: CreatePhieuB1Details): Promise<any>;
  findById(id: number): Promise<BangChiTieuB1>;
  edit(id: number, editParam: editB1): Promise<BangChiTieuB1>;
  getAll(): Promise<BangChiTieuB1[]>;
  delete(id: number[]): Promise<BangChiTieuB1[]>;
}
