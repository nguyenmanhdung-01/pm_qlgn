import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SaveChangesDacDiemHoDto {
  // @IsNotEmpty()
  // @IsString()
  //   readonly TruongThongTinID: number;

  //   //   @IsNotEmpty()
  //   //   @IsString()
  //   readonly TenTruongThongTin: string;

  //   readonly TruongThongTinChaID: number;
  userId?: number;

  @IsObject()
  @IsOptional()
  DacDiemHoGiaDinh: Record<string, any>;

  // Thêm các trường dữ liệu khác tùy theo yêu cầu của bạn
}
