// src/entities/mapping-dot-ra-soat-va-danh-sach-dieu-tra.entity.ts

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class MappingDotRaSoatVaDanhSachDieuTra {
  @PrimaryColumn()
  DotRaSoatID: number;

  @PrimaryColumn()
  DanhSachID: number;
}
