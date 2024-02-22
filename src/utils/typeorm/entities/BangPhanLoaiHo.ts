// src/entities/bang-phan-loai-ho.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BangThietLapNguongPL } from './BangThietLapNguongPL';

@Entity()
export class BangPhanLoaiHo {
  @PrimaryGeneratedColumn()
  PhanLoaiHoID: number;

  @Column()
  TenLoai: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;

  // Tạo liên kết với BangThietLapNguongPL
  @OneToMany(() => BangThietLapNguongPL, (nguong) => nguong.PhanLoaiHo)
  Nguong: BangThietLapNguongPL[];
}
