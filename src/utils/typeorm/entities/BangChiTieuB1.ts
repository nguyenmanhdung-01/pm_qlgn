// src/entities/bang-chitieu-b1.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangChiTieuB1 {
  @PrimaryGeneratedColumn()
  ChiTieuB1ID: number;

  @Column({ nullable: true })
  TenChiTieuB1: string;
  @Column({ nullable: true })
  ChiTieuChaID: number;
  @Column({ nullable: true })
  DiemB1: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
