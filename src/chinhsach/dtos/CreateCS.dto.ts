import { IsNotEmpty } from 'class-validator';

export class CreateChinhSach {
  @IsNotEmpty()
  TenChinhSach: string;
}
