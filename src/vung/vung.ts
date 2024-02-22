import { BangDanToc, BangDonVi, BangVung } from '../utils/typeorm';
import { CreateVungDetails, editDanToc, editVung } from '../utils/types';

export interface IVungService {
  createVung(vungDetails: CreateVungDetails): Promise<BangVung>;
  findById(id: number): Promise<BangVung>;
  findDonViById(
    id: number,
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }>;
  editVung(idVung: number, editVung: editVung): Promise<BangVung>;
  getAllVung(): Promise<BangVung[]>;
  deleteVung(id: number[]): Promise<BangVung[]>;
}
