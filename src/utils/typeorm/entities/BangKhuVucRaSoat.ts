// src/entities/bang-khu-vuc-ra-soat.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BangThietLapNguongPL } from './BangThietLapNguongPL';
import { BangPhanTichTheoCacNhomDoiTuong } from './BangPhanTichTheoCacNhomDoiTuong';

@Entity()
export class BangKhuVucRaSoat {
  @PrimaryGeneratedColumn()
  KhuVucRaSoatID: number;

  @Column({ nullable: false })
  TenKhuVuc: string;

  @Column({ nullable: false })
  LoaiKhuVuc: string;

  @Column({ nullable: true })
  GhiChu: string;

  // Tạo liên kết với BangKhuVucRaSoat
  @OneToMany(() => BangThietLapNguongPL, (nguong) => nguong.KhuVucRaSoat)
  @JoinColumn({ name: 'KhuVucRaSoatID' })
  Nguong: BangThietLapNguongPL[];

  @ManyToOne(() => BangPhanTichTheoCacNhomDoiTuong)
  @JoinColumn({ name: 'RowID' })
  PhanTichTheoCacNhomDoiTuong: BangPhanTichTheoCacNhomDoiTuong;

  @Column({ type: 'boolean', default: false, nullable: false })
  IsRemoved: boolean;
}
