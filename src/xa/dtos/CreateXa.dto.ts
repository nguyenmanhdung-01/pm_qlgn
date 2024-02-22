import { IsNotEmpty } from 'class-validator';

export class CreateXaDto {
  @IsNotEmpty()
  TenXa: string;

  @IsNotEmpty()
  HuyenID: number;
}
