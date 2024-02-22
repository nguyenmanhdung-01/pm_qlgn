import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  HoVaTen: string;

  @IsNotEmpty()
  NgaySinh: Date;

  @IsNotEmpty()
  GioiTinh: string;

  @IsNotEmpty()
  SDT: number;

  Email: string;

  ToChuc: string;

  @IsNotEmpty()
  TenDangNhap: string;

  @IsNotEmpty()
  MatKhau: string;
}
