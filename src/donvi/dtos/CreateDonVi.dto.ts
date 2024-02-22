import { IsNotEmpty } from 'class-validator';

export class CreateDonViDto {
  @IsNotEmpty()
  TenDonVi: string;

  // @IsNotEmpty()
  // ThonID: number;

  XaID: number;

  HuyenID: number;

  TinhID: number;

  @IsNotEmpty()
  VungID: number;

  DonViQuanLyID: number;
}
