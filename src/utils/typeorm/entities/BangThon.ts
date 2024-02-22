// src/entities/bang-thon.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BangXa } from './BangXa';
import { BangDonVi } from './BangDonVi';
import { BangCanBo } from './BangCanBo';

@Entity()
export class BangThon {
  @PrimaryGeneratedColumn()
  ThonID: number;

  @Column()
  TenThon: string;

  @Column()
  XaID: number;

  @ManyToOne(() => BangXa)
  @JoinColumn({ name: 'XaID' })
  Xa: BangXa;

  @OneToMany(() => BangDonVi, (donvi) => donvi.Thon)
  @JoinColumn()
  DonVi: BangDonVi[];

  @OneToMany(() => BangCanBo, (canbo) => canbo.Thon)
  @JoinColumn()
  CanBo: BangCanBo[];

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
