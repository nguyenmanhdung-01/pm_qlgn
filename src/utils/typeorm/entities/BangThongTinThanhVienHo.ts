// src/entities/bang-thong-tin-thanh-vien-ho.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangThongTinHo } from './BangThongTinHo';
import { BangDanToc } from './BangDanToc';
import { BangTenTruongThongTinTVH } from './BangTenTruongThongTinTVH';
import { BangThongTinChuHo } from './BangThongTinChuHo';

@Entity()
export class BangThongTinThanhVienHo {
  @PrimaryGeneratedColumn()
  ThanhVienID: number;

  @ManyToOne(() => BangThongTinHo)
  @JoinColumn({ name: 'HoGiaDinhID' })
  HoGiaDinhID: number;

  @Column({ nullable: true })
  HoVaTen: string;

  @Column({ default: '' })
  CmndCccd: string;

  @ManyToOne(() => BangDanToc)
  @JoinColumn({ name: 'DanTocID' })
  DanTocID: number;

  @ManyToOne(() => BangThongTinChuHo)
  @JoinColumn({ name: 'ChuHoID' })
  @Column({ nullable: true })
  ChuHoID: number;

  @Column({ nullable: true })
  NgaySinh: Date;

  @Column({ nullable: true })
  SDT: string;

  @Column({ nullable: true })
  GioiTinh: string;

  @Column({ type: 'json', nullable: true })
  DacDiemThanhVien: Record<string, any>;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
