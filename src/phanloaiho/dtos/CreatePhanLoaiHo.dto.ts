import { IsNotEmpty } from 'class-validator';

export class CreatePhanLoaiHoDto {
  @IsNotEmpty()
  TenLoai: string;
}
