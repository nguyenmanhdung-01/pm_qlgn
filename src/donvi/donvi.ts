import { BangDonVi } from '../utils/typeorm';
import { CreateDonviDetails, editDonVi, findByID } from '../utils/types';

export interface IDonViService {
  create(createDetail: CreateDonviDetails): Promise<any>;
  findById(id: number): Promise<BangDonVi>;
  findByListID(id: findByID): Promise<BangDonVi[]>;
  edit(id: number, editParam: editDonVi): Promise<BangDonVi>;
  getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }>;

  delete(id: number[]): Promise<BangDonVi[]>;
}
