// src/entities/bang-don-vi.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangXa } from './BangXa';
import { BangHuyen } from './BangHuyen';
import { BangTinh } from './BangTinh';
import { BangVung } from './BangVung';
import { BangThon } from './BangThon';

@Entity()
export class BangDonVi {
  @PrimaryGeneratedColumn()
  DonViID: number;

  @Column()
  TenDonVi: string;

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
  VungID: number;

  @ManyToOne(() => BangVung)
  @JoinColumn({ name: 'VungID' })
  Vung: BangVung;

  @Column({ nullable: true })
  DonViQuanLyID: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
