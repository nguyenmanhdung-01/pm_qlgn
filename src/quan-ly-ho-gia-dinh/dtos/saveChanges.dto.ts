// save-changes.dto.ts
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SaveChangesDto {
  //   @IsNotEmpty()
  //   @IsString()
  readonly TruongThongTinID: number;

  //   @IsNotEmpty()
  //   @IsString()
  readonly TenTruongThongTin: string;

  readonly TruongThongTinChaID: number;
  userId?: number;

  // @IsObject()
  // @IsOptional()
  // DacDiemHoGiaDinh: Record<string, any>;

  // Thêm các trường dữ liệu khác tùy theo yêu cầu của bạn
}
