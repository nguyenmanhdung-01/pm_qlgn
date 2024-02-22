export interface IDanhSachTaiLieu {
  getTaiLieuTheoDotRaSoat(DotRaSoatID);
  createDanhSachTaiLieu(danhSachTaiLieuDetail: any);
  editDanhSachTaiLieu(danhSachTaiLieuEdit: any);
  deleteOneDanhSachTaiLieu(TaiLieuID: number);
  deleteManyDanhSachTaiLieu(TaiLieuIDs: number[]);
}
