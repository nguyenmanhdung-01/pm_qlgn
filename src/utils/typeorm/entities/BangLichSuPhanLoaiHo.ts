import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangPhanLoaiHo } from './BangPhanLoaiHo';
import { BangThongTinHo } from './BangThongTinHo';
import { BangDanhSachDieuTra } from './BangDanhSachDieuTra';
import { BangUser } from './BangUser';

@Entity('')
export class BangLichSuPhanLoaiHo {
  @PrimaryGeneratedColumn()
  LichSuID: number;

  @ManyToOne(() => BangPhanLoaiHo)
  @JoinColumn({ name: 'PhanLoaiHoTruocKhiRaSoatID' })
  PhanLoaiHoTruocKhiRaSoatID: number;

  @ManyToOne(() => BangPhanLoaiHo)
  @JoinColumn({ name: 'PhanLoaiHoSauKhiRaSoatID' })
  @Column({ nullable: true })
  PhanLoaiHoSauKhiRaSoatID: number;

  @ManyToOne(() => BangThongTinHo)
  @JoinColumn({ name: 'HoGiaDinhID' })
  HoGiaDinhID: number;

  @ManyToOne(() => BangDanhSachDieuTra)
  @JoinColumn({ name: 'DanhSachDieuTraID' })
  DanhSachDieuTraID: number;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'NguoiChinhSuaID' })
  @Column({ nullable: true })
  NguoiChinhSuaID: number;

  @Column({ type: 'boolean', default: false })
  IsRemoved: boolean;
}
