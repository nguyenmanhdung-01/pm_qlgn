import { BangXa } from '../utils/typeorm';
import { CreateXaDetails, editXa } from '../utils/types';

export interface IXaService {
  create(createDetail: CreateXaDetails): Promise<any>;
  findById(id: number): Promise<BangXa>;
  findChildrenByIdParent(id: number): Promise<BangXa[]>;
  edit(id: number, editParam: editXa): Promise<BangXa>;
  getAll(): Promise<BangXa[]>;
  delete(id: number[]): Promise<BangXa[]>;
}
