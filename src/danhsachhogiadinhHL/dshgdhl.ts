import { CreateDSHGDHLDetails } from '../utils/types';
import { BangThongTinHoHL } from 'src/utils/typeorm/entities/BangThongTinHoGiaDinhHL';

export interface IHGDHLService {
  exportDanhSach09(data: any[]): Promise<any>;
  create(
    DonViID: number,
    KhuVucRaSoatID: number,
    dotRaSoatID: number,
    createDetail: CreateDSHGDHLDetails[],
  ): Promise<any>;
  getAll(): Promise<BangThongTinHoHL[]>;
  getByDRS(dotRaSoatID: number): Promise<any>;
  // getByXa(dotRaSoatID: number): Promise<any>;
}
