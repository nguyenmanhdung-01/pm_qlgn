// src/entities/bang-danh-sach-tai-lieu.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { BangPhanLoaiTaiLieu } from './BangPhanLoaiTaiLieu'; // Import thực thể liên quan (nếu có)
import { BangUser } from './BangUser';
import { BangDonVi } from './BangDonVi';

@Entity()
export class BangDanhSachBaoCao {
  @PrimaryGeneratedColumn()
  BaoCaoID: number;

  @Column({ nullable: true })
  TenBaoCao: string;

  @Column({ nullable: true })
  Url: string;

  @Column({ nullable: true })
  BackupUrl: string;

  @Column({ nullable: true })
  ChartUrl: string;

  @ManyToOne(() => BangPhanLoaiTaiLieu, { onDelete: 'SET NULL' }) // Ví dụ: Mối quan hệ nhiều-1 với bảng BangLoaiTaiLieu
  @JoinColumn({ name: 'LoaiTaiLieu' })
  LoaiTaiLieu: BangPhanLoaiTaiLieu;

  @ManyToOne(() => BangDonVi)
  @JoinColumn({ name: 'DonViID' })
  @Column({ nullable: true })
  DonViID: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  ThoiGianNhap: Date;

  @Column({ nullable: true })
  ThoiGianCapNhat: Date;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiTaoID' })
  NguoiTaoID: number;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiChinhSuaID' })
  @Column({ nullable: true })
  NguoiChinhSuaID: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;

  @BeforeUpdate()
  updateTimestamps() {
    this.ThoiGianCapNhat = new Date();
  }
}
