import { CreateTLNPLDetails, editTLNPL } from 'src/utils/types';
import { BangThietLapNguongPL } from 'src/utils/typeorm';

export interface ITLNPLService {
  create(createDetail: CreateTLNPLDetails): Promise<any>;
  findById(id: number): Promise<BangThietLapNguongPL>;
  edit(id: number, editParam: editTLNPL): Promise<BangThietLapNguongPL>;
  getAll(): Promise<BangThietLapNguongPL[]>;
  delete(id: number[]): Promise<BangThietLapNguongPL[]>;
}
