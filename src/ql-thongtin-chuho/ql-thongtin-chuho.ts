import { BangThongTinChuHo } from 'src/utils/typeorm';

export interface IQlTTChuHo {
  getChuHoById(idHoGiaDinh: number);
  getOneChuHoByIDHoGiaDinh(idHoGiaDinh: number);
}
