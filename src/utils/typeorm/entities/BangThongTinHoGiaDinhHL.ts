import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { BangDotRaSoat } from './BangDotRaSoat';
import { BangKhuVucRaSoat } from './BangKhuVucRaSoat';
import { BangDonVi } from './BangDonVi';

@Entity('')
export class BangThongTinHoHL {
  @PrimaryGeneratedColumn()
  RowID: number;

  @Column({ nullable: true })
  HoVaTenChuHo: string;

  @Column({ nullable: true })
  HoVaTenThanhVien: string;

  @Column({ nullable: true })
  ChuHoID: string;

  @Column({ nullable: true })
  QHVCH: string;

  @OneToOne(() => BangKhuVucRaSoat)
  @Column({ nullable: true })
  KhuVucRaSoatID: number;

  @OneToOne(() => BangDonVi)
  @Column({ nullable: true })
  DonViID: number;

  @Column({ nullable: true })
  NgaySinh: Date;

  @Column({ nullable: true })
  GioiTinh: string;

  @Column({ nullable: true })
  CCCD: string;

  @Column({ nullable: true })
  Tinh: string;

  @Column({ nullable: true })
  Huyen: string;

  @Column({ nullable: true })
  MaHuyen: string;

  @Column({ nullable: true })
  Xa: string;

  @Column({ nullable: true })
  MaXa: string;

  @Column({ nullable: true })
  Thon: string;

  @Column({ nullable: true })
  DanToc: string;

  @Column({ nullable: true })
  PhanLoaiHo: string;

  @Column({ nullable: true })
  QDCN: string;

  @Column({ nullable: true })
  NgayBanHanhQD: Date;

  @Column({ nullable: true })
  B1: string;

  @Column({ nullable: true })
  B2: string;

  @Column({ nullable: true })
  isDTTS: boolean;

  @Column({ nullable: true })
  isKNLD: boolean;

  @Column({ nullable: true })
  isTVCCCM: boolean;

  @Column({ nullable: true })
  NguyenNhanNgheo: string;

  @Column({ nullable: true })
  DiaChi: string;

  @Column({ nullable: true })
  GhiChu: string;

  @Column({ nullable: true })
  isThoatNgheo: boolean;

  @Column({ nullable: true })
  isThoatCanNgheo: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  ThoiDiemNhap: Date;

  @Column({ nullable: true })
  Tuoi: string;

  @Column({ nullable: true })
  SoNhanKhau: string;

  @OneToOne(() => BangDotRaSoat)
  @Column({ nullable: true })
  DotRaSoatID: number;

  @Column({ nullable: true })
  isChildren: boolean;

  @Column({ nullable: true, default: false })
  IsRemoved: boolean;

  // Định nghĩa các trường còn lại tương tự
}
