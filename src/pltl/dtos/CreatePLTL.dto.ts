import { IsNotEmpty } from 'class-validator';

export class CreatePLTLDto {
  @IsNotEmpty()
  TenLoaiTaiLieu: string;
}
