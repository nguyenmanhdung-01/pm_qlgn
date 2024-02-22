// src/entities/bang-loai-bieu-mau.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangLoaiBieuMau {
  @PrimaryGeneratedColumn()
  LoaiBieuMauID: number;

  @Column({ nullable: true })
  TenLoaiBieuMau: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
