import { IsNotEmpty } from 'class-validator';

export class CreateTinhDto {
  @IsNotEmpty()
  TenTinh: string;
}
