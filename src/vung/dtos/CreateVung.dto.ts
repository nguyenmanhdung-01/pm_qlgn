import { IsNotEmpty } from 'class-validator';

export class CreateVungDto {
  @IsNotEmpty()
  TenVung: string;
}
