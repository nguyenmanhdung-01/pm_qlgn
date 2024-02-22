import { IsNotEmpty } from 'class-validator';

export class CreatePhieuB1Dto {
  @IsNotEmpty()
  TenChiTieuB1: string;

  ChiTieuChaID: number;

  DiemB1: string;
}
