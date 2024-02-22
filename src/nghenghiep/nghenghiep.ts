import { BangNgheNghiep } from '../utils/typeorm';
import { CreateNgheNghiepDetails, editNgheNghiep } from '../utils/types';

export interface INgheNghiepService {
  create(createDetail: CreateNgheNghiepDetails): Promise<any>;
  findById(id: number): Promise<BangNgheNghiep>;
  edit(id: number, editParam: editNgheNghiep): Promise<BangNgheNghiep>;
  getAll(): Promise<BangNgheNghiep[]>;
  delete(id: number[]): Promise<BangNgheNghiep[]>;
}
