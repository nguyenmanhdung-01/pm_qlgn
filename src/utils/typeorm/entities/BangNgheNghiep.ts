// src/entities/bang-nghe-nghiep.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangNgheNghiep {
  @PrimaryGeneratedColumn()
  NgheNghiepID: number;

  @Column()
  TenNgheNghiep: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
