export interface IQuanLyHoGiaDinhHLService {
  getDanhSachHoNgheoCanNgheoByHuyen(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    HuyenID: any,
  );
  getDanhSachHoNgheoCanNgheoByXa(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  );
  getDanTocHoNgheoCanNgheoByXa(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  );
  getDanTocHoNgheoCanNgheoByHuyen(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    HuyenID: any,
  );
  getNguyenNhanNgheoHoNgheoCanNgheoByXa(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  );
  getNguyenNhanNgheoHoNgheoCanNgheoByHuyen(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    HuyenID: any,
  );
  getDanTocHoNgheoCanNgheoByXaV1(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  );
  exportDanhSach8(data: any);
  exportDanhSach16(data: any);
  exportDanhSach17(data: any);
}
