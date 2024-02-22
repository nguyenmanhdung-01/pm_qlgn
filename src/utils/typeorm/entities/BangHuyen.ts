// src/entities/bang-huyen.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BangTinh } from './BangTinh';
import { BangXa } from './BangXa';
import { BangDonVi } from './BangDonVi';
import { BangCanBo } from './BangCanBo';
import { BangPhanTichTheoCacNhomDoiTuong } from './BangPhanTichTheoCacNhomDoiTuong';

@Entity()
export class BangHuyen {
  @PrimaryGeneratedColumn()
  HuyenID: number;

  @Column()
  TenHuyen: string;

  @Column()
  TinhID: number;

  @ManyToOne(() => BangTinh)
  @JoinColumn({ name: 'TinhID' })
  Tinh: BangTinh;

  @OneToMany(() => BangXa, (xa) => xa.Huyen)
  @JoinColumn()
  Xa: BangXa[];

  @OneToMany(() => BangCanBo, (canbo) => canbo.Huyen)
  @JoinColumn()
  CanBo: BangCanBo[];

  @OneToMany(() => BangDonVi, (donvi) => donvi.Huyen)
  @JoinColumn()
  DonVi: BangDonVi[];

  @ManyToOne(() => BangPhanTichTheoCacNhomDoiTuong)
  @JoinColumn({ name: 'RowID' })
  PhanTichTheoCacNhomDoiTuong: BangPhanTichTheoCacNhomDoiTuong;

  @Column({ default: false, nullable: true })
  IsRemoved: boolean;
}
