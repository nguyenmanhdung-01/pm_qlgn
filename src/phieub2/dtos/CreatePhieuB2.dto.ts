import { IsNotEmpty } from 'class-validator';

export class CreatePhieuB2Dto {
  @IsNotEmpty()
  TenChiTieuB2: string;

  DiemB2: string;

  ChiTieuChaID: number;
}
