// src/entities/bang-ten-truong-thong-tin-tvh.entity.ts

import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
} from 'typeorm';
import { BangUser } from './BangUser';

@Entity()
export class BangTenTruongThongTinTVH {
  @PrimaryGeneratedColumn()
  TruongThongTinID: number;

  @Column({ default: '' })
  TenTruongTT: string;

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
  MaTT: string;

  @Column({ nullable: true })
  GiaTri: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;

  @BeforeUpdate()
  updateTimestamp() {
    this.ThoiGianCapNhat = new Date();
  }
}
