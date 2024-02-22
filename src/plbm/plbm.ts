import { BangLoaiBieuMau } from '../utils/typeorm';
import { CreatePLBMDetails, editPLBM } from '../utils/types';

export interface IPLBMService {
  create(createDetail: CreatePLBMDetails): Promise<any>;
  findById(id: number): Promise<BangLoaiBieuMau>;
  edit(id: number, editParam: editPLBM): Promise<BangLoaiBieuMau>;
  getAll(): Promise<BangLoaiBieuMau[]>;
  delete(id: number[]): Promise<BangLoaiBieuMau[]>;
}
