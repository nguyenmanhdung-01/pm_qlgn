// create-member.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsObject,
} from 'class-validator';

export class CreateMemberDto {
  //   @IsString()
  HoVaTen: string;

  //   @IsString()
  CmndCccd: string;

  @IsOptional()
  @IsDateString()
  NgaySinh: Date;

  //   @IsString()
  SDT: string;

  //   @IsString()
  GioiTinh: string;
  ChuHoID: number;

  DanTocID?: number;

  HoGiaDinhID?: number;

  @IsObject()
  @IsOptional()
  DacDiemThanhVien: Record<string, any>;
}
