import { IsNotEmpty } from 'class-validator';

export class CreateThonDto {
  @IsNotEmpty()
  TenThon: string;

  @IsNotEmpty()
  XaID: number;
}
