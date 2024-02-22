// src/entities/bang-role-group.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BangRoleGroup {
  @PrimaryGeneratedColumn()
  RoleGroupID: number;

  @Column()
  TenNhomQuyen: string;

  @Column('json', { nullable: true })
  NhomQuyen: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsRemoved: boolean;
}
