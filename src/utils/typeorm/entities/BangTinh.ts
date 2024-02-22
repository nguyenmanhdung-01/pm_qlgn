import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BangVung } from './BangVung';
import { BangHuyen } from './BangHuyen';
import { BangDonVi } from './BangDonVi';
import { BangCanBo } from './BangCanBo';

@Entity()
export class BangTinh {
  @PrimaryGeneratedColumn()
  TinhID: number;

  @Column()
  TenTinh: string;

  @Column()
  VungID: number;

  @ManyToOne(() => BangVung)
  @JoinColumn({ name: 'VungID' })
  Vung: BangVung;

  @OneToMany(() => BangHuyen, (huyen) => huyen.Tinh)
  Huyen: BangHuyen[];

  @OneToMany(() => BangCanBo, (canbo) => canbo.Tinh)
  @JoinColumn()
  CanBo: BangCanBo[];

  @OneToMany(() => BangDonVi, (donvi) => donvi.Tinh)
  @JoinColumn()
  DonVi: BangDonVi[];

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
