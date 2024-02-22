import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCanBoDto {
  @IsNotEmpty()
  MaCanBo: string;
  TenCanBo: string;
  Gioitinh: string;
  DonViID: number;
  NgaySinh: Date;
  CmndCccd: string;
  Avatar: string;
  SDT: string;
  // @IsEmail()
  Email: string;
  ChucVu: string;
}
