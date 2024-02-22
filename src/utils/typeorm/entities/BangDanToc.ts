// src/entities/bang-dan-toc.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangDanToc {
  @PrimaryGeneratedColumn()
  DanTocID: number;

  @Column()
  TenDanToc: string;

  @Column({ nullable: true })
  TenGoiKhac: string;

  @Column()
  PhanLoai: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
