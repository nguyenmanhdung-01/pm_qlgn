import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangTinh } from './BangTinh';
import { BangXa } from './BangXa';
import { BangHuyen } from './BangHuyen';
import { BangPhanLoaiHo } from './BangPhanLoaiHo';
import { BangKhuVucRaSoat } from './BangKhuVucRaSoat';
import { BangDonVi } from './BangDonVi';
import { BangThon } from './BangThon';

@Entity()
export class BangThongTinHo {
  @PrimaryGeneratedColumn()
  HoGiaDinhID: number;

  @Column({ nullable: true })
  MaHo: string;

  @ManyToOne(() => BangTinh)
  @JoinColumn({ name: 'TinhID' })
  TinhID: number;

  @ManyToOne(() => BangXa)
  @JoinColumn({ name: 'XaID' })
  XaID: number;

  @ManyToOne(() => BangHuyen)
  @JoinColumn({ name: 'HuyenID' })
  HuyenID: number;

  @ManyToOne(() => BangThon)
  @JoinColumn({ name: 'ThonID' })
  @Column({ nullable: true })
  ThonID: number;

  @ManyToOne(() => BangPhanLoaiHo)
  @JoinColumn({ name: 'PhanLoaiHoID' })
  PhanLoaiHoID: number;

  @Column({ type: 'json', nullable: true })
  LichSuHo: Record<string, any>;

  @Column({ nullable: true })
  DiaChi: string;

  @Column({ default: 'Đang chờ' })
  Status: string;

  @ManyToOne(() => BangDonVi)
  @JoinColumn({ name: 'DonViID' })
  DonViID: number;

  @ManyToOne(() => BangKhuVucRaSoat)
  @JoinColumn({ name: 'KhuVucRaSoatID' })
  KhuVucRaSoatID: number;

  @Column({ nullable: true })
  DiemB1: number;

  @Column({ nullable: true })
  DiemB2: number;

  @Column({ type: 'json', nullable: true })
  DacDiemHoGiaDinh: Record<string, any>;

  @Column({ nullable: true })
  isDTTS: boolean;

  @Column({ nullable: true })
  isKNLD: boolean;

  @Column({ nullable: true })
  isTVCCCM: boolean;

  @Column({ nullable: true })
  isThoatNgheo: boolean;

  @Column({ nullable: true })
  isCanNgheo: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
