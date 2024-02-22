import { IsNotEmpty } from 'class-validator';

export class CreateBieuMau {
  @IsNotEmpty()
  TenBieuMau: string;
  Url: string;
  LoaiBieuMauID: number;
}
