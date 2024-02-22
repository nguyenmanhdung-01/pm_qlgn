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
import { BangThongTinHo } from './BangThongTinHo';

@Entity()
export class BangDanhSachTaiLieu {
  @PrimaryGeneratedColumn()
  TaiLieuID: number;

  @Column({ nullable: true })
  TenTaiLieu: string;

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
  ThoiGianTao: Date;

  @ManyToOne(() => BangThongTinHo)
  @JoinColumn({ name: 'HoGiaDinhID' })
  @Column({ nullable: true })
  HoGiaDinhID: BangThongTinHo;

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

  @Column({ default: false })
  KetXuatBC: boolean;

  @BeforeUpdate()
  updateTimestamps() {
    this.ThoiGianCapNhat = new Date();
  }
}
