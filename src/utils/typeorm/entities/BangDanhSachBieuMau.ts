import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BangLoaiBieuMau } from './BangLoaiBieuMau';

@Entity()
export class BangDanhSachBieuMau {
  @PrimaryGeneratedColumn()
  BieuMauID: number;

  @Column()
  TenBieuMau: string;

  @Column()
  Url: string;

  @Column({ nullable: true })
  BackupUrl: string;

  @Column({ nullable: true })
  SourceUrl: string;

  @Column({ nullable: false })
  LoaiBieuMauID: number;

  @Column({ type: 'boolean', default: false })
  IsRemoved: boolean;

  @ManyToOne(() => BangLoaiBieuMau)
  @JoinColumn({ name: 'LoaiBieuMauID' })
  LoaiBieuMau: BangLoaiBieuMau;
}
