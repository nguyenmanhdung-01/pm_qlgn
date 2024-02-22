import { BangDanToc } from 'src/utils/typeorm';

export interface IQuanLyDanTocService {
  getAllDanToc(): Promise<BangDanToc[]>;
}
