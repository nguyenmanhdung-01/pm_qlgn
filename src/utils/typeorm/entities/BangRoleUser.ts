import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class BangRoleUser {
  @PrimaryGeneratedColumn()
  QuyenID: number;

  @Column({ nullable: true })
  QuyenIDCha: number;

  @Column({ type: 'varchar', length: 255 })
  TenQuyen: string;

  @Column({ default: false })
  IsRemoved: boolean;
}
