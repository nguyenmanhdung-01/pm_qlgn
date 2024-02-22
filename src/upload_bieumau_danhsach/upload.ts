export interface IUpLoadFileService {
  uploadDanhSach(file: any): Promise<any>;
  // uploadThongTinHoGiaDinh(file: any): Promise<any>;
  hashChuHoID(input: string): number;
}
