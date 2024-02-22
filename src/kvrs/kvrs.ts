import { BangDotRaSoat, BangKhuVucRaSoat } from '../utils/typeorm';
import { CreateKVRSDetails, editKVRS } from '../utils/types';

export interface IKVRSService {
  create(createDetail: CreateKVRSDetails): Promise<any>;
  findById(id: number): Promise<BangKhuVucRaSoat>;
  edit(id: number, editParam: editKVRS): Promise<BangKhuVucRaSoat>;
  getAll(): Promise<BangKhuVucRaSoat[]>;
  getAllDRS(): Promise<BangDotRaSoat[]>;
  delete(id: number[]): Promise<BangKhuVucRaSoat[]>;
}
