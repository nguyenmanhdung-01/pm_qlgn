// src/entities/bang-phan-loai-tai-lieu.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangPhanLoaiTaiLieu {
  @PrimaryGeneratedColumn()
  LoaiTaiLieuID: number;

  @Column({ nullable: true })
  TenLoaiTaiLieu: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
