import { BangHuyen } from '../utils/typeorm';
import { CreateHuyenDetails, editHuyen } from '../utils/types';

export interface IHuyenService {
  create(createDetail: CreateHuyenDetails): Promise<any>;
  findById(id: number): Promise<BangHuyen>;
  findChildrenByIdParent(id: number): Promise<BangHuyen[]>;
  edit(id: number, editParam: editHuyen): Promise<BangHuyen>;
  getAll(): Promise<BangHuyen[]>;
  delete(id: number[]): Promise<BangHuyen[]>;
}
