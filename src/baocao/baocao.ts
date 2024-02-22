import { BangDanhSachTaiLieu } from 'src/utils/typeorm';

export interface IBaoCaoService {
  getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
    exel: string,
  ): Promise<any>;
  findById(id: number): Promise<BangDanhSachTaiLieu>;
}
