// create-member.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsObject,
} from 'class-validator';

export class UpdateMemberDto {
  //   @IsString()
  HoVaTen: string;

  //   @IsString()
  CmndCccd: string;

  // @IsOptional()
  // @IsDateString()
  NgaySinh: Date;

  //   @IsString()
  SDT: string;

  //   @IsString()
  GioiTinh: string;

  DanTocID?: number;

  DacDiemThanhVien: Record<string, any>;
}
