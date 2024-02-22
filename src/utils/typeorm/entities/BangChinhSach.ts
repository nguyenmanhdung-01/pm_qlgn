// src/entities/bang-chinh-sach.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangChinhSach {
  @PrimaryGeneratedColumn()
  ChinhSachID: number;

  @Column()
  TenChinhSach: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
