// src/entities/bang-loai-dot-ra-soat.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangLoaiDotRaSoat {
  @PrimaryGeneratedColumn()
  LoaiDotRaSoatID: number;

  @Column({ default: 'Nhập tên đợt rà soát' })
  TenLoaiDotRS: string;
}
