// Ví dụ cho bảng BangCanBo
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangDanToc } from './BangDanToc';
import { BangDonVi } from './BangDonVi';
import { BangThon } from './BangThon';
import { BangXa } from './BangXa';
import { BangHuyen } from './BangHuyen';
import { BangTinh } from './BangTinh';

@Entity('')
export class BangCanBo {
  @PrimaryGeneratedColumn()
  CanBoID: number;

  @Column({ nullable: false })
  MaCanBo: string;

  @Column({ nullable: false })
  TenCanBo: string;

  @Column({ nullable: false })
  GioiTinh: string;

  @Column({ nullable: false })
  DonViID: number;

  @ManyToOne(() => BangDonVi)
  @JoinColumn({ name: 'DonViID' })
  DonVi: BangDonVi;

  @Column({ nullable: false })
  NgaySinh: Date;

  @Column({ nullable: true })
  DanTocID: number;

  @ManyToOne(() => BangDanToc)
  @JoinColumn({ name: 'DanTocID' })
  DanToc: BangDanToc;

  @Column({ length: 20, unique: true })
  CmndCccd: string;

  @Column({ nullable: true })
  ThonID: number;

  @ManyToOne(() => BangThon)
  @JoinColumn({ name: 'ThonID' })
  Thon: BangThon;

  @Column({ nullable: true })
  XaID: number;

  @ManyToOne(() => BangXa)
  @JoinColumn({ name: 'XaID' })
  Xa: BangXa;

  @Column({ nullable: true })
  HuyenID: number;

  @ManyToOne(() => BangHuyen)
  @JoinColumn({ name: 'HuyenID' })
  Huyen: BangHuyen;

  @Column({ nullable: true })
  TinhID: number;

  @ManyToOne(() => BangTinh)
  @JoinColumn({ name: 'TinhID' })
  Tinh: BangTinh;

  @Column({ nullable: true })
  Avatar: string;

  @Column({ nullable: true })
  SDT: string;

  @Column({ nullable: true })
  Email: string;

  @Column({ nullable: true })
  SoNha: string;

  @Column({ nullable: false })
  ChucVu: string;

  @Column({ default: false, nullable: true })
  IsRemoved: boolean;
}
