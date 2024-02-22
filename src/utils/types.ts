import { Request } from 'express';
import { BangUser } from './typeorm';
import { isNotEmpty } from 'class-validator';

enum RoleEnum {
  User = 'user',
  Admin = 'admin',
}
export default RoleEnum;

export type CreateUserDetails = {
  TenDangNhap: string;
  HoVaTen: string;
  MatKhau: string;
  Email: string;
};

export type CreateDanTocDetails = {
  TenDanToc: string;
  TenGoiKhac: string;
  PhanLoai: string;
};

export type CreatePTTCNDTDetails = {
  ThoiDiem: Date;
  KhuVucRaSoatID: number;
  VungID: number;
  TinhID: number;
  HuyenID: number;
  XaID: number;
  PhanTo: string;
  TongSoHo: string;
  TongSoHoDanTocThieuSo: string;
  TongSoHoNgheo: string;
  TongSoHoCanNgheo: string;
  SLHoNgheoDTTS: string;
  SLHoCanNgheoDTTS: string;
  SLHoNgheoKCKNLD: string;
  SLHoCanNgheoKCKNLD: string;
  SLHoNgheoCCVCM: string;
  SLHoCanNgheoCCVCM: string;
};

export type CreateDSHGDHLDetails = {
  HoVaTenChuHo: string;
  HoVaTenThanhVien: string;
  ChuHoID: string;
  QHVCH: string;
  NgaySinh: Date;
  GioiTinh: string;
  CCCD: string;
  Tinh: string;
  Huyen: string;
  MaHuyen: string;
  Xa: string;
  MaXa: string;
  Thon: string;
  DanToc: string;
  PhanLoaiHo: string;
  QDCN: string;
  NgayBanHanhQD: Date;
  B1: string;
  B2: string;
  isDTTS: boolean;
  isKNLD: boolean;
  isTVCCCM: boolean;
  NguyenNhanNgheo: string;
  DiaChi: string;
  GhiChu: string;
  isThoatNgheo: boolean;
  isThoatCanNgheo: boolean;
  Tuoi: string;
  SoNhanKhau: string;
  DotRaSoatID: number;
  isChildren: boolean;
  DonViID: number;
};

export type CreatePLHoDetails = {
  TenLoai: string;
};
export type CreatePhieuB1Details = {
  TenChiTieuB1: string;
  ChiTieuChaID: number;
  DiemB1: string;
};
export type CreateTLNPLDetails = {
  TenNguong: string;
  PhanLoaiHoID: number;
  KhuVucRaSoatID: number;
  NguongDiem: string;
};

export type CreatePhieuB2Details = {
  TenChiTieuB2: string;
  DiemB2: string;
  ChiTieuChaID: number;
};
export type CreateBieuMauDetails = {
  TenBieuMau: string;
  Url: string;
  LoaiBieuMauID: number;
};
export type CreatePLTLDetails = {
  TenLoaiTaiLieu: string;
};
export type CreatePLBMDetails = {
  TenLoaiBieuMau: string;
};
export type CreateChinhSachDetails = {
  TenChinhSach: string;
};
export type CreateKVRSDetails = {
  TenKhuVuc: string;
  LoaiKhuVuc: string;
  GhiChu: string;
};
export type CreateNgheNghiepDetails = {
  TenNgheNghiep: string;
};
export type CreateTinhDetails = {
  TenTinh: string;
};
export type CreateHuyenDetails = {
  TenHuyen: string;
  TinhID: number;
};
export type CreateDonviDetails = {
  TenDonVi: string;
  // ThonID: number;
  XaID: number;
  HuyenID: number;
  TinhID: number;
  VungID: number;
  DonViQuanLyID: number;
};
// export type TTHGDHL = {
//   TenDonVi: string;
//   // ThonID: number;
//   XaID: number;
//   HuyenID: number;
//   TinhID: number;
//   VungID: number;
//   DonViQuanLyID: number;
// };

export type CreateCanboDetails = {
  MaCanBo: string;
  TenCanBo: string;
  Gioitinh: string;
  DonViID: number;
  NgaySinh: Date;
  CmndCccd: string;
  Avatar: string;
  SDT: string;
  Email: string;
  ChucVu: string;
};

export type findByID = {
  VungID: number;
  XaID: number;
  HuyenID: number;
  TinhID: number;
  // DonViQuanLyID: number;
  // ThonID: number;
};
export type CreateXaDetails = {
  TenXa: string;
  HuyenID: number;
};

export type CreateThonDetails = {
  TenThon: string;
  XaID: number;
};

export type CreateVungDetails = {
  TenVung: string;
};

export type ValidateUserDetails = {
  TenDangNhap: string;
  password: string;
};

export type PayloadgenerateToken = {
  username: string;
};

export type TokenPayload = {
  userId: string;
};

export type editUser = {
  HoVaTen: string;
  NgaySinh: string;
  GioiTinh: string;
  SDT: string;
  Email: string;
  ToChuc: string;
  Avatar: string;
  RoleGroupID?: number;
};
export type editDanToc = {
  TenDanToc: string;
  TenGoiKhac: string;
  PhanLoai: string;
};
export type ChangPassWord = {
  passwordOld: string;
  passwordNew: string;
};

export type editTinh = {
  TenTinh: string;
  VungID: number;
};
export type editPLHo = {
  TenLoai: string;
};
export type editHo = {
  TenLoai: string;
};
export type editB1 = {
  TenChiTieuB1: string;
  DiemB1: string;
};
export type editTLNPL = {
  TenNguong: string;
  PhanLoaiHoID: number;
  KhuVucRaSoatID: number;
  NguongDiem: string;
};
export type editB2 = {
  TenChiTieuB2: string;
  DiemB2: string;
  ChiTieuChaID: number;
};
export type editPLTL = {
  TenLoaiTaiLieu: string;
};
export type editPLBM = {
  TenLoaiBieuMau: string;
};
export type editBieuMau = {
  TenBieuMau: string;
  Url: string;
  LoaiBieuMauID: number;
};
export type PaginationParams = {
  offset: string;
  limit: string;
};

export type editChinhSach = {
  TenChinhSach: string;
};
export type editKVRS = {
  TenKhuVuc: string;
  LoaiKhuVuc: string;
  GhiChu: string;
};
export type editNgheNghiep = {
  TenNgheNghiep: string;
};

export type editHuyen = {
  TenHuyen: string;
  TinhID: number;
};
export type editDonVi = {
  TenDonVi: string;
  ThonID: number;
  XaID: number;
  HuyenID: number;
  TinhID: number;
  VungID: number;
};

export type editCanBo = {
  MaCanBo: string;
  TenCanBo: string;
  Gioitinh: string;
  DonViID: number;
  NgaySinh: Date;
  CmndCccd: string;
  Avatar: string;
  SDT: string;
  Email: string;
  ChucVu: string;
};
export type editXa = {
  TenXa: string;
  HuyenID: number;
};
export type editThon = {
  TenThon: string;
  XaID: number;
};

export type editVung = {
  TenVung: string;
};

export interface AuthenticatedRequest extends Request {
  user: BangUser;
}

export interface RequestWithUser extends Request {
  user: BangUser;
}
