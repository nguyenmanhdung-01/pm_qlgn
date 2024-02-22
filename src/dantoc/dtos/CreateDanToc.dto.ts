import { IsNotEmpty } from 'class-validator';

export class CreateDanTocDto {
  @IsNotEmpty()
  TenDanToc: string;

  TenGoiKhac: string;

  PhanLoai: string;
}
