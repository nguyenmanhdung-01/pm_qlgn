import { BangThon } from '../utils/typeorm';
import { CreateThonDetails, editThon, editXa } from '../utils/types';

export interface IThonService {
  create(createDetail: CreateThonDetails): Promise<any>;
  findById(id: number): Promise<BangThon>;
  findChildrenByIdParent(id: number): Promise<BangThon[]>;
  edit(id: number, editParam: editThon): Promise<BangThon>;
  getAll(): Promise<BangThon[]>;
  delete(id: number[]): Promise<BangThon[]>;
}
