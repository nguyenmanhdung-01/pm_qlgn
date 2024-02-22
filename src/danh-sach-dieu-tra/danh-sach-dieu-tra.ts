export interface IDanhSachDieuTra {
  getAllDanhSachDieuTra(queryParams);
  getDanhSachDieuTraByID(DanhSachID);
  getDetailDanhSachDieuTra(DanhSachID);
  getDanhSachHoTrongDanhSachDieuTra(DanhSachID);
  getDanhSachTaiLieuTheoDot(DotRaSoatID);
  editDanhSachDieuTra(danhSachDieuTraEdit);
  updateStatusDanhSachDieuTra(danhsachDieuTraEditStatus);
  updateDanhSachHoTrongDanhSachDieuTra(DanhSachID);
  updateDanhSachTaiLieuTrongDanhSachDieuTra(DanhSachID);
  deleteDanhSachHoTrongDanhSachDieuTra(DanhSachID, DanhSachHo);
  createDanhSachDieuTra(danhSachDieuTra: any);
  deleteOneDanhSachDieuTra(DanhSachID: number);
  deleteManyDanhSachDieuTra(DanhSachIDs: number[]);
  getDanhSachHoByDotRaSoatID(DotRaSoatID);
  getPhanLoaiHo(DanhSachID);
  getStatusDotRaSoat();
}
