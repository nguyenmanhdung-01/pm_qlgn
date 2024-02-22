import { IsNotEmpty } from 'class-validator';

export class CreateHuyenDto {
  @IsNotEmpty()
  TenHuyen: string;

  @IsNotEmpty()
  TinhID: number;
}
