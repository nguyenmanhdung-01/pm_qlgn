import { BangDanhSachBaoCao } from 'src/utils/typeorm';

export interface IQuanLyBaoCao {
  createDanhSachBaoCao(danhSachBaoCaoDetail: any);
  getAllBaoCao(): Promise<BangDanhSachBaoCao[]>;
  deleteBaoCaoID(baoCaoID: number): Promise<boolean>;
  getBaoCao(id: number): Promise<BangDanhSachBaoCao>;
}
