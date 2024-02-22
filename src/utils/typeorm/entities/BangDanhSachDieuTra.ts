// src/entities/bang-danh-sach-dieu-tra.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangCanBo } from './BangCanBo';
import { BangDotRaSoat } from './BangDotRaSoat';
import { BangUser } from './BangUser';
import { BangDonVi } from './BangDonVi';

@Entity()
export class BangDanhSachDieuTra {
  @PrimaryGeneratedColumn()
  DanhSachID: number;

  @Column()
  TenDanhSach: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  ThoiGianTao: Date;

  @Column({ nullable: true })
  ThoiGianCapNhat: Date;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiTaoID' })
  @Column()
  NguoiTaoID: number;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiChinhSuaID' })
  @Column({ nullable: true })
  NguoiChinhSuaID: number;

  @Column('json')
  DanhSachHo: any; // Sử dụng kiểu 'json' cho trường DanhSachHo

  @ManyToOne(() => BangDotRaSoat)
  @JoinColumn({ name: 'DotRaSoatID' })
  @Column({ nullable: true })
  DotRaSoatID: number;

  @Column('json', { nullable: true })
  DanhSachTL: any; // Sử dụng kiểu 'json' cho trường DanhSachTL

  @ManyToOne(() => BangDonVi)
  @JoinColumn({ name: 'DonViID' })
  @Column({ nullable: true })
  DonViID: number;

  @ManyToOne(() => BangCanBo, { onDelete: 'SET NULL' }) // Ví dụ: Mối quan hệ nhiều-1 với bảng BangCanBo
  @JoinColumn({ name: 'CanBoID' })
  CanBoID: BangCanBo;

  @Column()
  Status: string;

  // Các trường còn lại của bảng ở đây

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
