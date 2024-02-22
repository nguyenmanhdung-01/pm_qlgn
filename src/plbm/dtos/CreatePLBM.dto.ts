import { IsNotEmpty } from 'class-validator';

export class CreatePLBMDto {
  @IsNotEmpty()
  TenLoaiBieuMau: string;
}
