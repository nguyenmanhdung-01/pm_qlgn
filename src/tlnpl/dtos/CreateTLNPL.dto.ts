import { IsNotEmpty } from 'class-validator';

export class CreateTLNPL {
  @IsNotEmpty()
  TenNguong: string;
  @IsNotEmpty()
  PhanLoaiHoID: number;
  @IsNotEmpty()
  KhuVucRaSoatID: number;
  @IsNotEmpty()
  NguongDiem: string;
}
