import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class UpdateChuHoDto {
  //   @IsString()
  HoVaTenChuHo: string;

  //   @IsString()
  CmndCccd: string;

  //   @IsNumber()
  DanTocID: number;

  //   @IsString()
  NgaySinh: Date;

  //   @IsString()
  SDT: string;

  //   @IsString()
  GioiTinh: string;
}
