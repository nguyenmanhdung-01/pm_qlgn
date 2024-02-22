// src/entities/bang-thong-tin-chu-ho.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangThongTinHo } from './BangThongTinHo';
import { BangDanToc } from './BangDanToc';

@Entity()
export class BangThongTinChuHo {
  @PrimaryGeneratedColumn()
  ChuHoID: number;

  @ManyToOne(() => BangThongTinHo)
  @JoinColumn({ name: 'HoGiaDinhID' })
  HoGiaDinhID: number;

  @Column({ nullable: true })
  HoVaTenChuHo: string;

  @Column()
  CmndCccd: string;

  @ManyToOne(() => BangDanToc)
  @JoinColumn({ name: 'DanTocID' })
  DanTocID: number;

  @Column({ nullable: true })
  NgaySinh: Date;

  @Column({ nullable: true })
  SDT: string;

  @Column({ nullable: true })
  GioiTinh: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
