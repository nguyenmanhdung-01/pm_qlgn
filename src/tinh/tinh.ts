import { BangDonVi, BangTinh } from '../utils/typeorm';
import { CreateTinhDetails, editTinh } from '../utils/types';

export interface ITinhService {
  create(createDetail: CreateTinhDetails): Promise<any>;
  findById(id: number): Promise<BangTinh>;
  findDonViById(
    id: number,
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }>;
  findChildrenByIdParent(id: number): Promise<BangTinh[]>;
  edit(id: number, editParam: editTinh): Promise<BangTinh>;
  getAll(): Promise<BangTinh[]>;
  delete(id: number[]): Promise<BangTinh[]>;
}
