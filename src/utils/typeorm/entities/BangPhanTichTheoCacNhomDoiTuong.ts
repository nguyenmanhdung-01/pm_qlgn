// row.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BangVung } from './BangVung';
import { BangTinh } from './BangTinh';
import { BangHuyen } from './BangHuyen';
import { BangKhuVucRaSoat } from './BangKhuVucRaSoat';
import { BangXa } from './BangXa';

@Entity()
export class BangPhanTichTheoCacNhomDoiTuong {
  @PrimaryGeneratedColumn()
  RowID: number;

  @Column({ nullable: true })
  ThoiDiem: Date;

  @OneToMany(() => BangKhuVucRaSoat, (kvrs) => kvrs.PhanTichTheoCacNhomDoiTuong)
  @JoinColumn({ name: 'KhuVucRaSoatID' })
  KhuVucRaSoat: BangKhuVucRaSoat[];

  @Column({ nullable: true })
  KhuVucRaSoatID: number;

  @OneToOne(() => BangVung)
  @JoinColumn()
  Vung: BangVung;

  @Column({ nullable: true })
  VungID: number;

  @OneToOne(() => BangTinh)
  @JoinColumn()
  Tinh: BangTinh;

  @Column({ nullable: true })
  TinhID: number;

  @OneToMany(() => BangHuyen, (huyen) => huyen.PhanTichTheoCacNhomDoiTuong)
  @JoinColumn({ name: 'HuyenID' })
  Huyen: BangHuyen[];

  @Column({ nullable: true })
  HuyenID: number;

  @OneToMany(() => BangXa, (xa) => xa.PhanTichTheoCacNhomDoiTuong)
  @JoinColumn({ name: 'XaID' })
  Xa: BangXa[];

  @Column({ nullable: true })
  XaID: number;
  @Column({ nullable: true })
  PhanTo: string;

  @Column({ nullable: true })
  TongSoHo: string;

  @Column({ nullable: true })
  TongSoHoDanTocThieuSo: string;

  @Column({ nullable: true })
  TongSoHoNgheo: string;

  @Column({ nullable: true })
  TongSoHoCanNgheo: string;

  @Column({ nullable: true })
  SLHoNgheoDTTS: string;

  @Column({ nullable: true })
  SLHoCanNgheoDTTS: string;

  @Column({ nullable: true })
  SLHoNgheoKCKNLD: string;

  @Column({ nullable: true })
  SLHoCanNgheoKCKNLD: string;

  @Column({ nullable: true })
  SLHoNgheoCCVCM: string;

  @Column({ nullable: true })
  SLHoCanNgheoCCVCM: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
