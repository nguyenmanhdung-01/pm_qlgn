import { BangLichSuPhanLoaiHo } from 'src/utils/typeorm';
import { createHistoryHo } from './dtos/createHistoryHo.dto';

export interface IPhanLoaiHo {
  createHistory(
    createHistoryDto: createHistoryHo,
  ): Promise<BangLichSuPhanLoaiHo>;
  getPhanLoaiDS(DanhSachID);
  updateAfterPlHo(afterPlh: any[]);
}
