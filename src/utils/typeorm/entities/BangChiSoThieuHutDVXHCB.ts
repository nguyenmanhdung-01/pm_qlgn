// src/bang-chi-so-thieu-hut-dvxhcb/bang-chi-so-thieu-hut-dvxhcb.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { BangPhanLoaiHo } from './BangPhanLoaiHo';
import { BangKhuVucRaSoat } from './BangKhuVucRaSoat';
import { BangVung } from './BangVung';
import { BangTinh } from './BangTinh';
import { BangHuyen } from './BangHuyen';
import { BangXa } from './BangXa';

@Entity()
export class BangChiSoThieuHutDVXHCB {
  @PrimaryGeneratedColumn({ name: 'RowID' })
  RowID: number;

  @Column({ nullable: true })
  thoiDiemKetXuat: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', nullable: false })
  thoiDiemNhap: Date;

  @ManyToOne(() => BangPhanLoaiHo, { nullable: false })
  @JoinColumn({ name: 'PhanLoaiHoID' })
  PhanLoaiHoID: number;

  @Column({ type: 'char', nullable: true })
  dataType: string;

  @ManyToOne(() => BangKhuVucRaSoat, { nullable: false })
  @JoinColumn({ name: 'KhuVucRaSoatID' })
  KhuVucRaSoatID: number;

  @ManyToOne(() => BangVung, { nullable: false })
  @JoinColumn({ name: 'VungID' })
  VungID: number;

  @ManyToOne(() => BangTinh, { nullable: false })
  @JoinColumn({ name: 'TinhID' })
  TinhID: number;

  @ManyToOne(() => BangHuyen, { nullable: false })
  @JoinColumn({ name: 'HuyenID' })
  HuyenID: number;

  @ManyToOne(() => BangXa, { nullable: false })
  @JoinColumn({ name: 'XaID' })
  XaID: number;

  @Column({ nullable: false })
  tongSoHo: number;

  @Column({ nullable: false })
  index1: number;

  @Column({ nullable: false })
  index2: number;

  @Column({ nullable: false })
  index3: number;

  @Column({ nullable: false })
  index4: number;

  @Column({ nullable: false })
  index5: number;

  @Column({ nullable: false })
  index6: number;

  @Column({ nullable: false })
  index7: number;

  @Column({ nullable: false })
  index8: number;

  @Column({ nullable: false })
  index9: number;

  @Column({ nullable: false })
  index10: number;

  @Column({ nullable: false })
  index11: number;

  @Column({ nullable: false })
  index12: number;

  @Column({ default: false, nullable: true })
  IsRemoved: boolean;
}
