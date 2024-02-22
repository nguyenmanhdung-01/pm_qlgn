// src/entities/bang-dot-ra-soat.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangLoaiDotRaSoat } from './BangLoaiDotRaSoat';
import { BangUser } from './BangUser';

@Entity()
export class BangDotRaSoat {
  @PrimaryGeneratedColumn()
  DotRaSoatID: number;

  @Column()
  TenDotRaSoat: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  DateCreated: Date;

  @Column()
  StartDate: Date;

  @Column()
  EndDate: Date;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'Creator' })
  Creator: number;

  @Column('json', { nullable: true })
  History: any;

  @ManyToOne(() => BangUser)
  @JoinColumn({ name: 'LastEditor' })
  @Column({ nullable: true })
  LastEditor: number;

  @ManyToOne(() => BangLoaiDotRaSoat)
  @JoinColumn({ name: 'LoaiDotRaSoatID' })
  LoaiDotRaSoatID: number;

  @Column({ default: 'Đang chờ' })
  Status: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
