export class CreateTaiLieuDto {
  TenTaiLieu: string;

  BackupUrl: string;

  Url: string;

  ChartUrl: string;

  DonViID?: number;

  LoaiTaiLieuID?: number;

  userId?: number;

  HoGiaDinhID?: number;
  // Các trường khác nếu cần
  KetXuatBC: boolean;
}
