// src/entities/bang-xa.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BangHuyen } from './BangHuyen';
import { BangDonVi } from './BangDonVi';
import { BangThon } from './BangThon';
import { BangCanBo } from './BangCanBo';
import { BangPhanTichTheoCacNhomDoiTuong } from './BangPhanTichTheoCacNhomDoiTuong';

@Entity()
export class BangXa {
  @PrimaryGeneratedColumn()
  XaID: number;

  @Column()
  TenXa: string;

  @Column()
  HuyenID: number;

  @ManyToOne(() => BangHuyen)
  @JoinColumn({ name: 'HuyenID' })
  Huyen: BangHuyen;

  @OneToMany(() => BangThon, (thon) => thon.Xa)
  @JoinColumn()
  Thon: BangThon[];

  @OneToMany(() => BangDonVi, (donvi) => donvi.Xa)
  @JoinColumn()
  DonVi: BangDonVi[];

  @OneToMany(() => BangCanBo, (canbo) => canbo.Xa)
  @JoinColumn()
  CanBo: BangCanBo[];
  @ManyToOne(() => BangPhanTichTheoCacNhomDoiTuong)
  @JoinColumn({ name: 'RowID' })
  PhanTichTheoCacNhomDoiTuong: BangPhanTichTheoCacNhomDoiTuong;

  @Column({ default: false, nullable: true })
  IsRemoved: boolean;
}
