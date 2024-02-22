// src/entities/bang-thiet-lap-nguong-pl.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangPhanLoaiHo } from './BangPhanLoaiHo';
import { BangKhuVucRaSoat } from './BangKhuVucRaSoat';

@Entity()
export class BangThietLapNguongPL {
  @PrimaryGeneratedColumn()
  NguongID: number;

  @Column({ nullable: true })
  TenNguong: string;

  @Column()
  PhanLoaiHoID: number;

  @Column()
  KhuVucRaSoatID: number;

  @Column()
  NguongDiem: string;

  @Column({ default: false, nullable: true })
  IsRemoved: boolean;

  // Tạo liên kết với BangPhanLoaiHo
  @ManyToOne(() => BangPhanLoaiHo, (phanLoaiHo) => phanLoaiHo.Nguong)
  @JoinColumn({ name: 'PhanLoaiHoID' })
  PhanLoaiHo: BangPhanLoaiHo;

  // Tạo liên kết với BangKhuVucRaSoat
  @ManyToOne(() => BangKhuVucRaSoat, (khuVucRaSoat) => khuVucRaSoat.Nguong)
  @JoinColumn({ name: 'KhuVucRaSoatID' })
  KhuVucRaSoat: BangKhuVucRaSoat;
}
