import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  BangHuyen,
  BangKhuVucRaSoat,
  BangPhanTichTheoCacNhomDoiTuong,
  BangTinh,
} from '../utils/typeorm';
import { CreatePTTCNDTDetails } from '../utils/types';
import { IPTTCNDTService } from './pttcndt';

// import { IRoleService } from 'src/role/role';

@Injectable()
export class PTTCNDTService implements IPTTCNDTService {
  constructor(
    @InjectRepository(BangPhanTichTheoCacNhomDoiTuong)
    private readonly plhoRepository: Repository<BangPhanTichTheoCacNhomDoiTuong>,
    @InjectRepository(BangHuyen)
    private readonly huyenRepository: Repository<BangHuyen>,
    @InjectRepository(BangKhuVucRaSoat)
    private readonly khuVucRaSoatRepository: Repository<BangKhuVucRaSoat>,
    @InjectRepository(BangTinh)
    private readonly tinhRepository: Repository<BangTinh>,
  ) {}

  async create(date: Date, createDetails: CreatePTTCNDTDetails[]) {
    const allRow = await this.getAll();
    // console.log('date', new Date(date));

    const dataDelete = allRow?.filter(
      (x) =>
        new Date(x.ThoiDiem).getTime() === new Date(date).getTime() &&
        x.IsRemoved !== true,
    );

    const idDelete = dataDelete?.map((item) => {
      return item?.RowID;
    });
    console.log('idDelete', idDelete);

    if (idDelete?.length !== 0) {
      this.plhoRepository.delete(idDelete);
      const saved = await this.plhoRepository.save(createDetails);
      return saved;
    } else {
      const saved = await this.plhoRepository.save(createDetails);
      return saved;
    }
  }
  async getAll(): Promise<BangPhanTichTheoCacNhomDoiTuong[]> {
    const results = await this.plhoRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }
  async delete(idDelete: number[]): Promise<BangPhanTichTheoCacNhomDoiTuong[]> {
    await this.plhoRepository
      .createQueryBuilder()
      .update(BangPhanTichTheoCacNhomDoiTuong)
      .set({ IsRemoved: true })
      .where('RowID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.plhoRepository.find();
    return dantoc;
  }

  async getAllThoiDiem() {
    const result = this.plhoRepository
      .createQueryBuilder('pttcndt')
      .select('DISTINCT(pttcndt.ThoiDiem)', 'ThoiDiem')
      .getRawMany();
    return result;
  }

  async getAllChart(
    time: any,
    phanTo: any,
    loaiHo: any,
    soLuongTiLe: any,
    thanhThiHayDanhSach: any,
  ) {
    // console.log('thanhThiHayDanhSach: ', thanhThiHayDanhSach);
    const tinhs = await this.tinhRepository.find({
      where: {
        TenTinh: Like('%Thanh Hóa%'),
      },
    });
    // console.log('tinh: ', tinhs);
    const tinhID = tinhs[0].TinhID;
    const dataTong = [];
    if (thanhThiHayDanhSach === 'danh_sach') {
      const danhSachHuyen = await this.huyenRepository
        .createQueryBuilder('huyen')
        .where('huyen.TinhID = :tinhID', { tinhID: tinhID })
        .getMany();
      for (const item of danhSachHuyen) {
        const sumField = loaiHo === 'ho_ngheo' ? 'Ngheo' : 'CanNgheo';

        const tong = this.plhoRepository.createQueryBuilder('phanTich');
        tong.where('phanTich.ThoiDiem = :thoiDiem', { thoiDiem: time });
        tong.andWhere('phanTich.HuyenID = :huyenID', { huyenID: item.HuyenID });
        tong.andWhere('phanTich.PhanTo = :phanTo', { phanTo: phanTo });

        if (soLuongTiLe === 'so_luong') {
          tong.select([
            `SUM(phanTich.SLHo${sumField}DTTS) as tongSoHoNgheoDTTS`,
            `SUM(phanTich.SLHo${sumField}KCKNLD) as tongSoHoNgheoKCKNLD`,
            `SUM(phanTich.SLHo${sumField}CCVCM) as tongSoHoNgheoCCVCM`,
          ]);
        } else if (soLuongTiLe === 'ti_le') {
          tong.select([
            `ROUND((SUM(phanTich.SLHo${sumField}DTTS) / SUM(phanTich.TongSoHo${sumField})) * 100, 2) as tongSoHoNgheoDTTS`,
            `ROUND((SUM(phanTich.SLHo${sumField}KCKNLD) / SUM(phanTich.TongSoHo${sumField})) * 100, 2) as tongSoHoNgheoKCKNLD`,
            `ROUND((SUM(phanTich.SLHo${sumField}CCVCM) / SUM(phanTich.TongSoHo${sumField})) * 100, 2) as tongSoHoNgheoCCVCM`,
          ]);
        }

        const result = await tong.getRawOne();
        const formatData = {
          name: item.TenHuyen,
          data: [
            result.tongSoHoNgheoDTTS || 0,
            result.tongSoHoNgheoKCKNLD || 0,
            result.tongSoHoNgheoCCVCM || 0,
          ],
        };

        dataTong.push(formatData);
      }
    } else {
      const danhSachKhuVucRaSoat = await this.khuVucRaSoatRepository
        .createQueryBuilder('khuVucRaSoat')
        .getMany();
      // console.log('danhSachKhuVucRaSoat: ', danhSachKhuVucRaSoat);

      for (const item of danhSachKhuVucRaSoat) {
        const sumField = loaiHo === 'ho_ngheo' ? 'Ngheo' : 'CanNgheo';

        const tong = this.plhoRepository.createQueryBuilder('phanTich');
        tong.where('phanTich.ThoiDiem = :thoiDiem', { thoiDiem: time });
        tong.andWhere('phanTich.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: item.KhuVucRaSoatID,
        });
        tong.andWhere('phanTich.PhanTo = :phanTo', { phanTo: phanTo });
        if (soLuongTiLe === 'so_luong') {
          tong.select([
            `phanTich.SLHo${sumField}DTTS as tongSoHoNgheoDTTS`,
            `phanTich.SLHo${sumField}KCKNLD as tongSoHoNgheoKCKNLD`,
            `phanTich.SLHo${sumField}CCVCM as tongSoHoNgheoCCVCM`,
          ]);
        } else if (soLuongTiLe === 'ti_le') {
          tong.select([
            `ROUND(((phanTich.SLHo${sumField}DTTS) / (phanTich.TongSoHo${sumField})) * 100, 2) as tongSoHoNgheoDTTS`,
            `ROUND(((phanTich.SLHo${sumField}KCKNLD) / (phanTich.TongSoHo${sumField})) * 100, 2) as tongSoHoNgheoKCKNLD`,
            `ROUND(((phanTich.SLHo${sumField}CCVCM) / (phanTich.TongSoHo${sumField})) * 100, 2) as tongSoHoNgheoCCVCM`,
          ]);
        }
        const result = await tong.getRawOne();
        // console.log('result: ', result);
        if (result) {
          const formatData = {
            name: item.TenKhuVuc,
            data: [
              parseFloat(result?.tongSoHoNgheoDTTS) || 0,
              parseFloat(result?.tongSoHoNgheoKCKNLD) || 0,
              parseFloat(result?.tongSoHoNgheoCCVCM) || 0,
            ],
          };
          // console.log('formatData: ', formatData);
          dataTong.push(formatData);
        }
      }
    }

    return dataTong;
  }
}
