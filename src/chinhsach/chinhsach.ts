import { BangChinhSach } from '../utils/typeorm';
import { CreateChinhSachDetails, editChinhSach } from '../utils/types';

export interface IChinhSachService {
  create(createDetail: CreateChinhSachDetails): Promise<any>;
  findById(id: number): Promise<BangChinhSach>;
  edit(id: number, editParam: editChinhSach): Promise<BangChinhSach>;
  getAll(): Promise<BangChinhSach[]>;
  delete(id: number[]): Promise<BangChinhSach[]>;
}
