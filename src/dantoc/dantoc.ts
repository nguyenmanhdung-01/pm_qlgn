import { BangDanToc } from '../utils/typeorm';
import { CreateDanTocDetails, editDanToc } from '../utils/types';

export interface IDanTocService {
  createDanToc(dantocDetails: CreateDanTocDetails): Promise<BangDanToc>;
  findById(id: number): Promise<BangDanToc>;
  editDanToc(idDantoc: number, editDanToc: editDanToc): Promise<BangDanToc>;
  getAllDanToc(): Promise<BangDanToc[]>;
  deleteDanToc(id: number[]): Promise<BangDanToc[]>;
}
