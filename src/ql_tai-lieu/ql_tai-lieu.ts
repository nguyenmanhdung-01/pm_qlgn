import { BangDanhSachTaiLieu } from 'src/utils/typeorm';
import { CreateTaiLieuDto } from './dtos/CreateDocument.dto';
import { UpdateTaiLieuDto } from './dtos/UpdateDocument.dto';

export interface IQuanLyTaiLieu {
  createTaiLieu(
    UserId: number,
    LoaiTaiLieuID: number,
    DonViID: number,
    taiLieuDto: CreateTaiLieuDto,
    HoGiaDinhID: number,
  ): Promise<BangDanhSachTaiLieu>;

  deleteMultiple(ids: number[]);
  deleteTruongThongTinHo(id: number);
  getAllTaiLieu(): Promise<BangDanhSachTaiLieu[]>;
  getAllTaiLieuHoGD(idHoGiaDinh: number): Promise<BangDanhSachTaiLieu[]>;
  getAllDocument(queryParams: any);
  updateTaiLieu(
    id: number,
    nguoiChinhSua: number,
    taiLieuDto: UpdateTaiLieuDto,
  ): Promise<BangDanhSachTaiLieu>;
  getTaiLieu(id: number);
  getAllDocumentKetXuat(queryParams: any);
}
