// src/entities/bang-vung.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BangTinh } from './BangTinh';
import { BangDonVi } from './BangDonVi';

@Entity()
export class BangVung {
  @PrimaryGeneratedColumn()
  VungID: number;

  @Column()
  TenVung: string;

  @OneToMany(() => BangTinh, (tinh) => tinh.Vung)
  @JoinColumn()
  Tinh: BangTinh[];

  @OneToMany(() => BangDonVi, (donvi) => donvi.Vung)
  @JoinColumn()
  DonVi: BangDonVi[];

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
