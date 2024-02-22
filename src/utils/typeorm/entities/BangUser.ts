// src/entities/bang-user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangCanBo } from './BangCanBo';
import { BangRoleGroup } from './BangRoleGroup';
import { BangDanToc } from './BangDanToc';

@Entity()
export class BangUser {
  @PrimaryGeneratedColumn()
  UserID: number;

  @Column()
  HoVaTen: string;

  @Column()
  NgaySinh: Date;

  @Column()
  GioiTinh: string;

  @Column({ nullable: true })
  SDT: string;

  @Column({ nullable: true })
  Email: string;

  @Column({ nullable: true })
  ToChuc: string;

  @ManyToOne(() => BangRoleGroup)
  @JoinColumn({ name: 'RoleGroupID' })
  @Column({ nullable: true })
  RoleGroupID: number;

  @Column({ nullable: true })
  Avatar: string;

  @ManyToOne(() => BangCanBo)
  @JoinColumn({ name: 'CanBoID' })
  @Column({ nullable: true })
  CanBoID: number;

  @Column()
  TenDangNhap: string;

  @Column()
  MatKhau: string;

  @ManyToOne(() => BangDanToc)
  @JoinColumn({ name: 'DanTocID' })
  DanTocID: number;

  @Column({ nullable: true, default: 'resgistered' })
  Status: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  Created: Date;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
