import { IsOptional, IsString } from 'class-validator';

export class CreateTruongThongTinHoDto {
  //   @IsString()

  userId?: number;
  // @IsString()
  TenTruongThongTin: string;

  TruongThongTinChaID: number | null;
}
