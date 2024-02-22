// src/entities/mapping-dot-ra-soat-va-tai-lieu-lien-quan.entity.ts

import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BangDotRaSoat } from './BangDotRaSoat';
import { BangDanhSachTaiLieu } from './BangDanhSachTaiLieu';

@Entity()
export class MappingDotRaSoatVaTaiLieuLienQuan {
  @PrimaryColumn()
  @ManyToOne(() => BangDotRaSoat)
  @JoinColumn({ name: 'DotRaSoatID' })
  DotRaSoatID: number;

  @PrimaryColumn()
  @ManyToOne(() => BangDanhSachTaiLieu)
  @JoinColumn({ name: 'TaiLieuID' })
  TaiLieuID: number;
}
