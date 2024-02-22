import { IsNotEmpty } from 'class-validator';

export class CreateNNDto {
  @IsNotEmpty()
  TenNgheNghiep: string;
}
