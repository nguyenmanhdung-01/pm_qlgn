import { createChiSoDto } from './dtos/createChiSoDto.dto';

export interface IChiSoThieuHut {
  getChiSoByID(
    PhanLoaiHoID: number,
    TinhID: number,
    HuyenID: number,
    thoiDiemKetXuat: number,
  );
  processExcelFile(file: any, khuVuc: createChiSoDto);
  getThoiDiemKetXuat();
  generateExcelFile(data);
}
