// src/entities/bang-truong-thong-tin-ho.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { BangUser } from './BangUser';

@Entity()
export class BangTruongThongTinHo {
  @PrimaryGeneratedColumn()
  TruongThongTinID: number;

  @Column({ default: '' })
  TenTruongThongTin: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  ThoiGianTao: Date;

  @Column({ nullable: true })
  ThoiGianCapNhat: Date;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiTaoID' })
  NguoiTaoID: number;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiChinhSuaID' })
  @Column({ nullable: true })
  NguoiChinhSuaID: number;

  @Column({ nullable: true })
  TruongThongTinChaID: number;

  @Column({ nullable: true })
  GhiChu: string;

  @Column({ nullable: true })
  GiaTri: string;

  @Column({ type: 'json', nullable: true })
  DanhSachHo: Record<string, any>;

  @Column({ type: 'boolean', default: false, nullable: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;

  @BeforeUpdate()
  updateTimestamps() {
    this.ThoiGianCapNhat = new Date();
  }
}
