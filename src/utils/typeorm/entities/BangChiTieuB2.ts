// src/entities/bang-chi-tieu-b2.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangChiTieuB2 {
  @PrimaryGeneratedColumn()
  ChiTieuB2ID: number;

  @Column({ nullable: true })
  TenChiTieuB2: string;

  @Column({ nullable: true })
  ChiTieuChaID: number;

  @Column({ nullable: true })
  DiemB2: string;

  @Column({ nullable: true })
  GhiChu: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
