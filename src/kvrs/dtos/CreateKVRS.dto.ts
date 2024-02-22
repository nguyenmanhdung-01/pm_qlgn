import { IsNotEmpty } from 'class-validator';

export class CreateKVRSDto {
  @IsNotEmpty()
  TenKhuVuc: string;

  @IsNotEmpty()
  LoaiKhuVuc: string;

  GhiChu: string;
}
