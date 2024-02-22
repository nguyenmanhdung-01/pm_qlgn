import { BangDanhSachBieuMau } from '../utils/typeorm';
import { CreateBieuMauDetails, editBieuMau } from '../utils/types';

export interface IBieuMauService {
  create(createDetail: CreateBieuMauDetails): Promise<any>;
  findById(id: number): Promise<BangDanhSachBieuMau>;
  edit(id: number, editParam: editBieuMau): Promise<BangDanhSachBieuMau>;
  getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<any>;
  delete(id: number[]): Promise<BangDanhSachBieuMau[]>;
}
