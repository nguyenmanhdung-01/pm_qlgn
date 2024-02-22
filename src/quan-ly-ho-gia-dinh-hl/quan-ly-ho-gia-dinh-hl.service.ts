import { Injectable, Inject } from '@nestjs/common';
import { IQuanLyHoGiaDinhHLService } from './quanLyHoGiaDinhHL';
import { InjectRepository } from '@nestjs/typeorm';
import { BangThongTinHoHL } from 'src/utils/typeorm/entities/BangThongTinHoGiaDinhHL';
import { Like, Repository } from 'typeorm';
import * as XlsxTemplate from 'xlsx-template';
import * as fs from 'fs';
import {
  BangDonVi,
  BangDotRaSoat,
  BangHuyen,
  BangKhuVucRaSoat,
  BangPhanLoaiHo,
  BangThon,
  BangXa,
} from 'src/utils/typeorm';
import * as path from 'path';

@Injectable()
export class QuanLyHoGiaDinhHlService implements IQuanLyHoGiaDinhHLService {
  constructor(
    @InjectRepository(BangThongTinHoHL)
    private readonly bangThongTinHoHLRepository: Repository<BangThongTinHoHL>,
    @InjectRepository(BangKhuVucRaSoat)
    private readonly khuVucRaSoatRepository: Repository<BangKhuVucRaSoat>,
    @InjectRepository(BangHuyen)
    private readonly huyenRepository: Repository<BangHuyen>,
    @InjectRepository(BangXa)
    private readonly xaRepository: Repository<BangXa>,
    @InjectRepository(BangPhanLoaiHo)
    private readonly phanLoaiHoRepository: Repository<BangPhanLoaiHo>,
    @InjectRepository(BangThon)
    private readonly thonRepository: Repository<BangThon>,
    @InjectRepository(BangDonVi)
    private readonly donViRepository: Repository<BangDonVi>,
    @InjectRepository(BangDotRaSoat)
    private readonly dotRaSoatRepository: Repository<BangDotRaSoat>,
  ) {}
  async getDanhSachHoNgheoCanNgheoByHuyen(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    HuyenID: any,
  ) {
    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.HuyenID = :huyenID', { huyenID: HuyenID })
      .getOne();

    const donRaSoat = await this.dotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :dotRaSoatID', {
        dotRaSoatID: DotRaSoatID,
      })
      .select('dotRaSoat.DateCreated')

      .getOne();
    const idLoaiHoNgheo = await this.phanLoaiHoRepository
      .createQueryBuilder('phanLoaiHo')
      .where('(phanLoaiHo.TenLoai = :khuVuc1)', {
        khuVuc1: 'Hộ nghèo',
        isRemoved: false,
      })
      .andWhere('phanLoaiHo.IsRemoved = :isRemoved', { isRemoved: false })
      .select('phanLoaiHo.PhanLoaiHoID')
      .getOne();
    const idLoaiHoCanNgheo = await this.phanLoaiHoRepository
      .createQueryBuilder('phanLoaiHo')
      .where('(phanLoaiHo.TenLoai = :khuVuc1)', {
        khuVuc1: 'Hộ cận nghèo',
        isRemoved: false,
      })
      .andWhere('phanLoaiHo.IsRemoved = :isRemoved', { isRemoved: false })
      .select('phanLoaiHo.PhanLoaiHoID')
      .getOne();
    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();

    // const huyen = await this.huyenRepository.find({
    //   where: {
    //     TenHuyen: Like('%Hậu Lộc%'),
    //   },
    // });
    // const huyenID = huyen[0].HuyenID;
    const danhSachXa = await this.xaRepository
      .createQueryBuilder('xa')
      .where('xa.HuyenID = :huyenID', { huyenID: HuyenID })
      .getMany();
    // console.log('danhSachXa: ', danhSachXa);

    const arrKhuVucThanhThi = [];
    for (const itemXa of danhSachXa) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'COUNT(ho.ChuHoID) AS SoHo',
          'SUM(ho.SoNhanKhau) AS SoNhanKhauSum',
          'ho.Xa as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Xa = :xa', { xa: itemXa.TenXa })
        .groupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();
      //   console.log('result: ', result);

      //   if (result.length) {
      arrKhuVucThanhThi.push(...result);
      //   }
      //   console.log('result: ', result);
    }
    const arrKhuVucThanhThiHoNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucThanhThiHoCanNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );

    const arrKhuVucNongThon = [];
    for (const itemXa of danhSachXa) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'COUNT(ho.ChuHoID) AS SoHo',
          'SUM(ho.SoNhanKhau) AS SoNhanKhauSum',
          'ho.Xa as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatNongThon.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Xa = :xa', { xa: itemXa.TenXa })
        .groupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();
      //   console.log('result: ', result);

      //   if (result.length) {
      arrKhuVucNongThon.push(...result);
      //   }
      //   console.log('result: ', result);
    }
    const arrKhuVucNongThonHoNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucNongThonHoCanNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );
    return {
      arrKhuVucThanhThiHoNgheo,
      arrKhuVucThanhThiHoCanNgheo,
      arrKhuVucNongThonHoNgheo,
      arrKhuVucNongThonHoCanNgheo,
      idDonVi: donVi?.DonViID || null,
      tenDonVi: donVi?.TenDonVi || null,
      namRaSoat: donRaSoat?.DateCreated,
    };
  }

  async getDanhSachHoNgheoCanNgheoByXa(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  ) {
    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.XaID = :xaID', { xaID: XaID })
      .getOne();

    const donRaSoat = await this.dotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :dotRaSoatID', {
        dotRaSoatID: DotRaSoatID,
      })
      .select('dotRaSoat.DateCreated')

      .getOne();
    console.log('donRaSoat: ', donRaSoat);

    const idLoaiHoNgheo = await this.phanLoaiHoRepository
      .createQueryBuilder('phanLoaiHo')
      .where('(phanLoaiHo.TenLoai = :khuVuc1)', {
        khuVuc1: 'Hộ nghèo',
        isRemoved: false,
      })
      .andWhere('phanLoaiHo.IsRemoved = :isRemoved', { isRemoved: false })
      .select('phanLoaiHo.PhanLoaiHoID')
      .getOne();
    const idLoaiHoCanNgheo = await this.phanLoaiHoRepository
      .createQueryBuilder('phanLoaiHo')
      .where('(phanLoaiHo.TenLoai = :khuVuc1)', {
        khuVuc1: 'Hộ cận nghèo',
        isRemoved: false,
      })
      .andWhere('phanLoaiHo.IsRemoved = :isRemoved', { isRemoved: false })
      .select('phanLoaiHo.PhanLoaiHoID')
      .getOne();
    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    const danhSachThon = await this.thonRepository
      .createQueryBuilder('thon')
      .where('thon.XaID = :xaID', { xaID: XaID })
      .getMany();
    // console.log('danhSachThon: ', danhSachThon);
    const arrKhuVucThanhThi = [];
    for (const itemThon of danhSachThon) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'COUNT(ho.ChuHoID) AS SoHo',
          'SUM(ho.SoNhanKhau) AS SoNhanKhauSum',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .groupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();
      //   console.log('result: ', result);

      //   if (result.length) {
      arrKhuVucThanhThi.push(...result);
      //   }
      //   console.log('result: ', result);
    }
    console.log('arrKhuVucThanhThi vao day: ', arrKhuVucThanhThi);
    const result = [];

    // Tạo một đối tượng map để theo dõi dữ liệu dựa trên trường "Ten"
    const dataMap = new Map();

    arrKhuVucThanhThi.forEach((item) => {
      const { KhuVuaRaSoatID, Ten, PhanLoaiHoID, SoHo } = item;
      if (dataMap.has(Ten)) {
        const existingItem = dataMap.get(Ten);
        existingItem[`PhanLoaiHoID${PhanLoaiHoID}`] = PhanLoaiHoID;
        existingItem[`SoHo${PhanLoaiHoID}`] = SoHo;
      } else {
        const newItem = { KhuVuaRaSoatID, Ten };
        newItem[`PhanLoaiHoID${PhanLoaiHoID}`] = PhanLoaiHoID;
        newItem[`SoHo${PhanLoaiHoID}`] = SoHo;
        dataMap.set(Ten, newItem);
      }
    });

    result.push(...dataMap.values());

    console.log('result: ', result);
    const arrKhuVucThanhThiHoNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucThanhThiHoCanNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );

    const arrKhuVucNongThon = [];
    for (const itemThon of danhSachThon) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'COUNT(ho.ChuHoID) AS SoHo',
          'SUM(ho.SoNhanKhau) AS SoNhanKhauSum',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatNongThon.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .groupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();
      //   console.log('result: ', result);

      //   if (result.length) {
      arrKhuVucNongThon.push(...result);
      //   }
      //   console.log('result: ', result);
    }
    const arrKhuVucNongThonHoNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucNongThonHoCanNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );
    return {
      arrKhuVucThanhThiHoNgheo,
      arrKhuVucThanhThiHoCanNgheo,
      arrKhuVucNongThonHoNgheo,
      arrKhuVucNongThonHoCanNgheo,
      idDonVi: donVi?.DonViID || null,
      tenDonVi: donVi?.TenDonVi || null,
      namRaSoat: donRaSoat?.DateCreated,
    };
  }

  async getDanTocHoNgheoCanNgheoByXa(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  ) {
    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.XaID = :xaID', { xaID: XaID })
      .getOne();

    const donRaSoat = await this.dotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :dotRaSoatID', {
        dotRaSoatID: DotRaSoatID,
      })
      .select('dotRaSoat.DateCreated')

      .getOne();

    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    const danhSachThon = await this.thonRepository
      .createQueryBuilder('thon')
      .where('thon.XaID = :xaID', { xaID: XaID })
      .getMany();
    const arrKhuVucThanhThi = [];
    for (const itemThon of danhSachThon) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanToc',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .groupBy('ho.DanToc')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucThanhThi.push(...result);
    }
    const arrKhuVucThanhThiHoNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucThanhThiHoCanNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );

    const arrKhuVucNongThon = [];
    for (const itemThon of danhSachThon) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanToc',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatNongThon.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .groupBy('ho.DanToc')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucNongThon.push(...result);
    }
    const arrKhuVucNongThonHoNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucNongThonHoCanNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );
    return {
      arrKhuVucThanhThiHoNgheo,
      arrKhuVucThanhThiHoCanNgheo,
      arrKhuVucNongThonHoNgheo,
      arrKhuVucNongThonHoCanNgheo,
      idDonVi: donVi?.DonViID || null,
      tenDonVi: donVi?.TenDonVi || null,
      namRaSoat: donRaSoat?.DateCreated,
    };
  }

  async getDanTocHoNgheoCanNgheoByHuyen(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    HuyenID: any,
  ) {
    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.HuyenID = :huyenID', { huyenID: HuyenID })
      .getOne();

    const donRaSoat = await this.dotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :dotRaSoatID', {
        dotRaSoatID: DotRaSoatID,
      })
      .select('dotRaSoat.DateCreated')

      .getOne();
    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();

    // const huyen = await this.huyenRepository.find({
    //   where: {
    //     TenHuyen: Like('%Hậu Lộc%'),
    //   },
    // });
    // const huyenID = huyen[0].HuyenID;
    const danhSachXa = await this.xaRepository
      .createQueryBuilder('xa')
      .where('xa.HuyenID = :huyenID', { huyenID: HuyenID })
      .getMany();
    console.log('danhSachXa: ', danhSachXa);
    const arrKhuVucThanhThi = [];
    for (const itemXa of danhSachXa) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanToc',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Xa as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Xa = :xa', { xa: itemXa.TenXa })
        .groupBy('ho.DanToc')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucThanhThi.push(...result);
    }
    const arrKhuVucThanhThiHoNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucThanhThiHoCanNgheo = arrKhuVucThanhThi.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );

    const arrKhuVucNongThon = [];
    for (const itemXa of danhSachXa) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanToc',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Xa as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatNongThon.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Xa = :xa', { xa: itemXa.TenXa })
        .groupBy('ho.DanToc')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucNongThon.push(...result);
    }
    const arrKhuVucNongThonHoNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 1,
    );
    const arrKhuVucNongThonHoCanNgheo = arrKhuVucNongThon.filter(
      (item) => Number(item.PhanLoaiHoID) === 2,
    );
    return {
      arrKhuVucThanhThiHoNgheo,
      arrKhuVucThanhThiHoCanNgheo,
      arrKhuVucNongThonHoNgheo,
      arrKhuVucNongThonHoCanNgheo,
      idDonVi: donVi?.DonViID || null,
      tenDonVi: donVi?.TenDonVi || null,
      namRaSoat: donRaSoat?.DateCreated,
    };
  }

  async getNguyenNhanNgheoHoNgheoCanNgheoByXa(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  ) {
    console.log('XaID: ', XaID);

    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.XaID = :xaID', { xaID: XaID })
      .getOne();
    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    const danhSachThon = await this.thonRepository
      .createQueryBuilder('thon')
      .where('thon.XaID = :xaID', { xaID: XaID })
      .getMany();
    const arrKhuVucThanhThi = [];
    for (const itemThon of danhSachThon) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.NguyenNhanNgheo as NguyenNhanNgheo',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .groupBy('ho.NguyenNhanNgheo')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucThanhThi.push(...result);
    }

    const arrKhuVucNongThon = [];
    for (const itemThon of danhSachThon) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.NguyenNhanNgheo as NguyenNhanNgheo',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatNongThon.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .groupBy('ho.NguyenNhanNgheo')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucNongThon.push(...result);
    }
    return {
      arrKhuVucThanhThi,
      arrKhuVucNongThon,
      idDonVi: donVi?.DonViID || null,
      tenDonVi: donVi?.TenDonVi || null,
    };
  }

  async getNguyenNhanNgheoHoNgheoCanNgheoByHuyen(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    HuyenID: any,
  ) {
    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.HuyenID = :huyenID', { huyenID: HuyenID })
      .getOne();

    const donRaSoat = await this.dotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :dotRaSoatID', {
        dotRaSoatID: DotRaSoatID,
      })
      .select('dotRaSoat.DateCreated')

      .getOne();
    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();

    // const huyen = await this.huyenRepository.find({
    //   where: {
    //     TenHuyen: Like('%Hậu Lộc%'),
    //   },
    // });
    // const huyenID = huyen[0].HuyenID;
    const danhSachXa = await this.xaRepository
      .createQueryBuilder('xa')
      .where('xa.HuyenID = :huyenID', { huyenID: HuyenID })
      .getMany();
    console.log('danhSachXa: ', danhSachXa);
    const arrKhuVucThanhThi = [];
    for (const itemXa of danhSachXa) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.NguyenNhanNgheo as NguyenNhanNgheo',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Xa as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Xa = :xa', { xa: itemXa.TenXa })
        .groupBy('ho.NguyenNhanNgheo')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucThanhThi.push(...result);
    }

    const arrKhuVucNongThon = [];
    for (const itemXa of danhSachXa) {
      const queryBuilder = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVucRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.NguyenNhanNgheo as NguyenNhanNgheo',
          'COUNT(ho.ChuHoID) AS SoHo',
          'ho.Xa as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatNongThon.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Xa = :xa', { xa: itemXa.TenXa })
        .groupBy('ho.NguyenNhanNgheo')
        .addGroupBy('ho.PhanLoaiHo');

      const result = await queryBuilder.getRawMany();

      arrKhuVucNongThon.push(...result);
    }
    return {
      arrKhuVucThanhThi,
      arrKhuVucNongThon,
      idDonVi: donVi?.DonViID || null,
      tenDonVi: donVi?.TenDonVi || null,
    };
  }

  async getDanTocHoNgheoCanNgheoByXaV1(
    DotRaSoatID: any,
    LoaiTaiLieuID: number,
    XaID: any,
  ) {
    const donVi = await this.donViRepository
      .createQueryBuilder('donvi')
      .where('donvi.XaID = :xaID', { xaID: XaID })
      .getOne();

    const donRaSoat = await this.dotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :dotRaSoatID', {
        dotRaSoatID: DotRaSoatID,
      })
      .select('dotRaSoat.DateCreated')

      .getOne();

    const idKhuVucRaSoatThanhThi = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực thành thị',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    // console.log('idKhuVucRaSoatThanhThi: ', idKhuVucRaSoatThanhThi);

    const idKhuVucRaSoatNongThon = await this.khuVucRaSoatRepository
      .createQueryBuilder('khuVucRaSoat')
      .where('(khuVucRaSoat.TenKhuVuc = :khuVuc1)', {
        khuVuc1: 'Khu vực nông thôn',
      })
      .andWhere('khuVucRaSoat.IsRemoved = :isRemoved', { isRemoved: false })
      .select('khuVucRaSoat.KhuVucRaSoatID')
      .getOne();
    const danhSachThon = await this.thonRepository
      .createQueryBuilder('thon')
      .where('thon.XaID = :xaID', { xaID: XaID })
      .getMany();
    const arrKhuVucThanhThi = [];
    for (const itemThon of danhSachThon) {
      const queryBuilderDanTocKinh = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanTocKinh',
          'COUNT(ho.ChuHoID) AS SoHoKinh',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .andWhere('DanToc = :danToc', { danToc: '1' })
        .groupBy('ho.PhanLoaiHo');

      const resultDanTocKinh = await queryBuilderDanTocKinh.getRawMany();

      const queryBuilderDanTocMuong = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanTocMuong',
          'COUNT(ho.ChuHoID) AS SoHoMuong',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .andWhere('DanToc = :danToc', { danToc: '6' })
        .groupBy('ho.PhanLoaiHo');

      const resultDanTocMuong = await queryBuilderDanTocMuong.getRawMany();

      const queryBuilderDanTocThai = this.bangThongTinHoHLRepository
        .createQueryBuilder('ho')
        .select([
          'ho.KhuVucRaSoatID as KhuVuaRaSoatID',
          'ho.PhanLoaiHo as PhanLoaiHoID',
          'ho.DanToc as DanTocThai',
          'COUNT(ho.ChuHoID) AS SoHoThai',
          'ho.Thon as Ten',
        ])
        .where('ho.HoVaTenChuHo IS NOT NULL')
        .andWhere('ho.KhuVucRaSoatID = :khuVucRaSoatID', {
          khuVucRaSoatID: idKhuVucRaSoatThanhThi.KhuVucRaSoatID,
        })
        .andWhere('ho.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: DotRaSoatID,
        })
        .andWhere('Thon = :thon', { thon: itemThon.TenThon })
        .andWhere('DanToc = :danToc', { danToc: '3' })
        .groupBy('ho.PhanLoaiHo');

      const resultDanTocThai = await queryBuilderDanTocThai.getRawMany();

      arrKhuVucThanhThi.push(
        ...resultDanTocKinh,
        ...resultDanTocMuong,
        ...resultDanTocThai,
      );
    }
    return arrKhuVucThanhThi;
  }

  async exportDanhSach8(data: any) {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1;
    const currentDay = currentTime.getDate();
    const values = {
      tong_so_hn_tt: data.totalThanhThiHoNgheo,
      tong_nk_hn_tt: data.totalSoNhanKhauThanhThiHoNgheo,
      tong_so_hcn_tt: data.totalThanhThiHoCanNgheo,
      tong_nk_hcn_tt: data.totalSoNhanKhauThanhThiHoCanNgheo,
      tong_so_hn_nt: data.totalNongThonHoNgheo,
      tong_nk_hn_nt: data.totalSoNhanKhauNongThonHoNgheo,
      tong_so_hcn_nt: data.totalNongThonHoCanNgheo,
      tong_nk_hcn_nt: data.totalSoNhanKhauNongThonHoCanNgheo,
      tong_so_hn: data.totalThanhThiHoNgheo + data.totalNongThonHoNgheo,
      tong_so_hcn: data.totalThanhThiHoCanNgheo + data.totalNongThonHoCanNgheo,
      tong_nk_hn:
        data.totalSoNhanKhauThanhThiHoNgheo +
        data.totalSoNhanKhauNongThonHoNgheo,
      tong_nk_hcn:
        data.totalSoNhanKhauThanhThiHoCanNgheo +
        data.totalSoNhanKhauNongThonHoCanNgheo,
      arrThanhThiHoNgheo: data.arrThanhThiHoNgheo,
      arrThanhThiHoCanNgheo: data.arrThanhThiHoCanNgheo,
      arrNongThonHoNgheo: data.arrNongThonHoNgheo,
      arrNongThonHoCanNgheo: data.arrNongThonHoCanNgheo,
      ten_don_vi: data.tenDonVi,
      nam_ra_soat: data.namRaSoat,
      ngay: currentDay,
      thang: currentMonth,
      nam: currentYear,
    };

    const templateDataPath = path.join(
      __dirname,
      '../../public/uploads',
      'Book1.xlsx',
    );
    const templateData = fs.readFileSync(templateDataPath);
    const template = new XlsxTemplate(templateData);
    const sheetNumber = 1;
    template.substitute(sheetNumber, values);
    const outputData = template.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const outputFilePath = 'output.xlsx';
    fs.writeFileSync(outputFilePath, outputData, 'binary');
    const fileContent = fs.readFileSync(outputFilePath);

    return fileContent;
  }

  async exportDanhSach16(data: any) {
    console.log('data: ', data);
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1;
    const currentDay = currentTime.getDate();
    const values = {
      totalThanhThiHoNgheo: data.totalThanhThiHoNgheo,
      totalThanhThiHoCanNgheo: data.totalThanhThiHoCanNgheo,
      totalNongThonHoNgheo: data.totalNongThonHoNgheo,
      totalNongThonHoCanNgheo: data.totalNongThonHoCanNgheo,
      totalThanhThiHoNgheoKinh: data.totalThanhThiHoNgheoKinh,
      totalThanhThiHoCanNgheoKinh: data.totalThanhThiHoCanNgheoKinh,
      totalNongThonHoNgheoKinh: data.totalNongThonHoNgheoKinh,
      totalNongThonHoCanNgheoKinh: data.totalNongThonHoCanNgheoKinh,
      totalThanhThiHoNgheoMuong: data.totalThanhThiHoNgheoMuong,
      totalThanhThiHoCanNgheoMuong: data.totalThanhThiHoCanNgheoMuong,
      totalNongThonHoNgheoMuong: data.totalNongThonHoNgheoMuong,
      totalNongThonHoCanNgheoMuong: data.totalNongThonHoCanNgheoMuong,
      totalThanhThiHoNgheoThai: data.totalThanhThiHoNgheoThai,
      totalThanhThiHoCanNgheoThai: data.totalThanhThiHoCanNgheoThai,
      totalNongThonHoNgheoThai: data.totalNongThonHoNgheoThai,
      totalNongThonHoCanNgheoThai: data.totalNongThonHoCanNgheoThai,
      totalThanhThiHoNgheoMong: data.totalThanhThiHoNgheoMong,
      totalThanhThiHoCanNgheoMong: data.totalThanhThiHoCanNgheoMong,
      totalNongThonHoNgheoMong: data.totalNongThonHoNgheoMong,
      totalNongThonHoCanNgheoMong: data.totalNongThonHoCanNgheoMong,
      totalThanhThiHoNgheoTho: data.totalThanhThiHoNgheoTho,
      totalThanhThiHoCanNgheoTho: data.totalThanhThiHoCanNgheoTho,
      totalNongThonHoNgheoTho: data.totalNongThonHoNgheoTho,
      totalNongThonHoCanNgheoTho: data.totalNongThonHoCanNgheoTho,
      totalThanhThiHoNgheoDao: data.totalThanhThiHoNgheoDao,
      totalThanhThiHoCanNgheoDao: data.totalThanhThiHoCanNgheoDao,
      totalNongThonHoNgheoDao: data.totalNongThonHoNgheoDao,
      totalNongThonHoCanNgheoDao: data.totalNongThonHoCanNgheoDao,
      totalThanhThiHoNgheoKhac: data.totalThanhThiHoNgheoKhac,
      totalThanhThiHoCanNgheoKhac: data.totalThanhThiHoCanNgheoKhac,
      totalNongThonHoNgheoKhac: data.totalNongThonHoNgheoKhac,
      totalNongThonHoCanNgheoKhac: data.totalNongThonHoCanNgheoKhac,
      totalThanhThiHoNgheoTongSo: data.totalThanhThiHoNgheoTongSo,
      totalThanhThiHoCanNgheoTongSo: data.totalThanhThiHoCanNgheoTongSo,
      totalNongThonHoNgheoTongSo: data.totalNongThonHoNgheoTongSo,
      totalNongThonHoCanNgheoTongSo: data.totalNongThonHoCanNgheoTongSo,
      totalHoNgheo: data.totalThanhThiHoNgheo + data.totalNongThonHoNgheo,
      totalHoCanNgheo:
        data.totalThanhThiHoCanNgheo + data.totalNongThonHoCanNgheo,
      totalHoNgheoTongSo:
        data.totalThanhThiHoNgheoTongSo + data.totalNongThonHoNgheoTongSo,
      totalHoCanNgheoTongSo:
        data.totalThanhThiHoCanNgheoTongSo + data.totalNongThonHoCanNgheoTongSo,
      totalHoNgheoKinh:
        data.totalThanhThiHoNgheoKinh + data.totalNongThonHoNgheoKinh,
      totalHoCanNgheoKinh:
        data.totalThanhThiHoCanNgheoKinh + data.totalNongThonHoCanNgheoKinh,
      totalHoNgheoMuong:
        data.totalThanhThiHoNgheoMuong + data.totalNongThonHoNgheoMuong,
      totalHoCanNgheoMuong:
        data.totalThanhThiHoCanNgheoMuong + data.totalNongThonHoCanNgheoMuong,
      totalHoNgheoThai:
        data.totalThanhThiHoNgheoThai + data.totalNongThonHoNgheoThai,
      totalHoCanNgheoThai:
        data.totalThanhThiHoCanNgheoThai + data.totalNongThonHoCanNgheoThai,
      totalHoNgheoMong:
        data.totalThanhThiHoNgheoMong + data.totalNongThonHoNgheoMong,
      totalHoCanNgheoMong:
        data.totalThanhThiHoCanNgheoMong + data.totalNongThonHoCanNgheoMong,
      totalHoNgheoTho:
        data.totalThanhThiHoNgheoTho + data.totalNongThonHoNgheoTho,
      totalHoCanNgheoTho:
        data.totalThanhThiHoCanNgheoTho + data.totalNongThonHoCanNgheoTho,
      totalHoNgheoDao:
        data.totalThanhThiHoNgheoDao + data.totalNongThonHoNgheoDao,
      totalHoCanNgheoDao:
        data.totalThanhThiHoCanNgheoDao + data.totalNongThonHoCanNgheoDao,
      totalHoNgheoKhac:
        data.totalThanhThiHoNgheoKhac + data.totalNongThonHoNgheoKhac,
      totalHoCanNgheoKhac:
        data.totalThanhThiHoCanNgheoKhac + data.totalNongThonHoCanNgheoKhac,
      newResultArrKhuVucThanhThiHoNgheo: data.newResultArrKhuVucThanhThiHoNgheo,
      newResultArrKhuVucThanhThiHoCanNgheo:
        data.newResultArrKhuVucThanhThiHoCanNgheo,
      newResultArrKhuVucNongThonHoNgheo: data.newResultArrKhuVucNongThonHoNgheo,
      newResultArrKhuVucNongThonHoCanNgheo:
        data.newResultArrKhuVucNongThonHoCanNgheo,
      ten_don_vi: data.tenDonVi,
      nam: currentYear,
      thang: currentMonth,
      ngay: currentDay,
    };
    // console.log('value: ', values);
    const templateDataPath = path.join(
      __dirname,
      '../../public/uploads',
      'mau16.xlsx',
    );
    const templateData = fs.readFileSync(templateDataPath);
    const template = new XlsxTemplate(templateData);
    const sheetNumber = 1;
    template.substitute(sheetNumber, values);
    const outputData = template.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const outputFilePath = 'output.xlsx';
    fs.writeFileSync(outputFilePath, outputData, 'binary');
    const fileContent = fs.readFileSync(outputFilePath);

    return fileContent;
  }

  async exportDanhSach17(data: any) {
    console.log('data: ', data);
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1;
    const currentDay = currentTime.getDate();
    const values = {
      totalHoNgheoNguyenNhan1TT: data.totalHoNgheoNguyenNhan1TT,
      totalHoCanNgheoNguyenNhan1TT: data.totalHoCanNgheoNguyenNhan1TT,
      sumNguyenNhanNgheo1TT: data.sumNguyenNhanNgheo1TT,
      totalHoNgheoNguyenNhan2TT: data.totalHoNgheoNguyenNhan2TT,
      totalHoCanNgheoNguyenNhan2TT: data.totalHoCanNgheoNguyenNhan2TT,
      sumNguyenNhanNgheo2TT: data.sumNguyenNhanNgheo2TT,
      totalHoNgheoNguyenNhan3TT: data.totalHoNgheoNguyenNhan3TT,
      totalHoCanNgheoNguyenNhan3TT: data.totalHoCanNgheoNguyenNhan3TT,
      sumNguyenNhanNgheo3TT: data.sumNguyenNhanNgheo3TT,
      totalHoNgheoNguyenNhan4TT: data.totalHoNgheoNguyenNhan4TT,
      totalHoCanNgheoNguyenNhan4TT: data.totalHoCanNgheoNguyenNhan4TT,
      sumNguyenNhanNgheo4TT: data.sumNguyenNhanNgheo4TT,
      totalHoNgheoNguyenNhan5TT: data.totalHoNgheoNguyenNhan5TT,
      totalHoCanNgheoNguyenNhan5TT: data.totalHoCanNgheoNguyenNhan5TT,
      sumNguyenNhanNgheo5TT: data.sumNguyenNhanNgheo5TT,
      totalHoNgheoNguyenNhan6TT: data.totalHoNgheoNguyenNhan6TT,
      totalHoCanNgheoNguyenNhan6TT: data.totalHoCanNgheoNguyenNhan6TT,
      sumNguyenNhanNgheo6TT: data.sumNguyenNhanNgheo6TT,
      totalHoNgheoNguyenNhan7TT: data.totalHoNgheoNguyenNhan7TT,
      totalHoCanNgheoNguyenNhan7TT: data.totalHoCanNgheoNguyenNhan7TT,
      sumNguyenNhanNgheo7TT: data.sumNguyenNhanNgheo7TT,
      totalHoNgheoNguyenNhanKhacTT: data.totalHoNgheoNguyenNhanKhacTT,
      totalHoCanNgheoNguyenNhanKhacTT: data.totalHoCanNgheoNguyenNhanKhacTT,
      sumNguyenNhanNgheoKhacTT: data.sumNguyenNhanNgheoKhacTT,
      totalHoNgheoNguyenNhan1NT: data.totalHoNgheoNguyenNhan1NT,
      totalHoCanNgheoNguyenNhan1NT: data.totalHoCanNgheoNguyenNhan1NT,
      sumNguyenNhanNgheo1NT: data.sumNguyenNhanNgheo1NT,
      totalHoNgheoNguyenNhan2NT: data.totalHoNgheoNguyenNhan2NT,
      totalHoCanNgheoNguyenNhan2NT: data.totalHoCanNgheoNguyenNhan2NT,
      sumNguyenNhanNgheo2NT: data.sumNguyenNhanNgheo2NT,
      totalHoNgheoNguyenNhan3NT: data.totalHoNgheoNguyenNhan3NT,
      totalHoCanNgheoNguyenNhan3NT: data.totalHoCanNgheoNguyenNhan3NT,
      sumNguyenNhanNgheo3NT: data.sumNguyenNhanNgheo3NT,
      totalHoNgheoNguyenNhan4NT: data.totalHoNgheoNguyenNhan4NT,
      totalHoCanNgheoNguyenNhan4NT: data.totalHoCanNgheoNguyenNhan4NT,
      sumNguyenNhanNgheo4NT: data.sumNguyenNhanNgheo4NT,
      totalHoNgheoNguyenNhan5NT: data.totalHoNgheoNguyenNhan5NT,
      totalHoCanNgheoNguyenNhan5NT: data.totalHoCanNgheoNguyenNhan5NT,
      sumNguyenNhanNgheo5NT: data.sumNguyenNhanNgheo5NT,
      totalHoNgheoNguyenNhan6NT: data.totalHoNgheoNguyenNhan6NT,
      totalHoCanNgheoNguyenNhan6NT: data.totalHoCanNgheoNguyenNhan6NT,
      sumNguyenNhanNgheo6NT: data.sumNguyenNhanNgheo6NT,
      totalHoNgheoNguyenNhan7NT: data.totalHoNgheoNguyenNhan7NT,
      totalHoCanNgheoNguyenNhan7NT: data.totalHoCanNgheoNguyenNhan7NT,
      sumNguyenNhanNgheo7NT: data.sumNguyenNhanNgheo7NT,
      totalHoNgheoNguyenNhanKhacNT: data.totalHoNgheoNguyenNhanKhacNT,
      totalHoCanNgheoNguyenNhanKhacNT: data.totalHoCanNgheoNguyenNhanKhacNT,
      sumNguyenNhanNgheoKhacNT: data.sumNguyenNhanNgheoKhacNT,
      sumNguyenNhanNgheo1HoNgheo:
        data.totalHoNgheoNguyenNhan1TT + data.totalHoNgheoNguyenNhan1NT,
      sumNguyenNhanNgheo2HoNgheo:
        data.totalHoNgheoNguyenNhan2TT + data.totalHoNgheoNguyenNhan2NT,
      sumNguyenNhanNgheo3HoNgheo:
        data.totalHoNgheoNguyenNhan3TT + data.totalHoNgheoNguyenNhan3NT,
      sumNguyenNhanNgheo4HoNgheo:
        data.totalHoNgheoNguyenNhan4TT + data.totalHoNgheoNguyenNhan4NT,
      sumNguyenNhanNgheo5HoNgheo:
        data.totalHoNgheoNguyenNhan5TT + data.totalHoNgheoNguyenNhan5NT,
      sumNguyenNhanNgheo6HoNgheo:
        data.totalHoNgheoNguyenNhan6TT + data.totalHoNgheoNguyenNhan6NT,
      sumNguyenNhanNgheo7HoNgheo:
        data.totalHoNgheoNguyenNhan7TT + data.totalHoNgheoNguyenNhan7NT,
      sumNguyenNhanNgheoKhacHoNgheo:
        data.totalHoNgheoNguyenNhanKhacTT + data.totalHoNgheoNguyenNhanKhacNT,
      sumNguyenNhanNgheo1HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan1TT + data.totalHoCanNgheoNguyenNhan1NT,
      sumNguyenNhanNgheo2HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan2TT + data.totalHoCanNgheoNguyenNhan2NT,
      sumNguyenNhanNgheo3HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan3TT + data.totalHoCanNgheoNguyenNhan3NT,
      sumNguyenNhanNgheo4HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan4TT + data.totalHoCanNgheoNguyenNhan4NT,
      sumNguyenNhanNgheo5HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan5TT + data.totalHoCanNgheoNguyenNhan5NT,
      sumNguyenNhanNgheo6HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan6TT + data.totalHoCanNgheoNguyenNhan6NT,
      sumNguyenNhanNgheo7HoCanNgheo:
        data.totalHoCanNgheoNguyenNhan7TT + data.totalHoCanNgheoNguyenNhan7NT,
      sumNguyenNhanNgheoKhacHoCanNgheo:
        data.totalHoCanNgheoNguyenNhanKhacTT +
        data.totalHoCanNgheoNguyenNhanKhacNT,
      sumNguyenNhanNgheo1:
        data.sumNguyenNhanNgheo1TT + data.sumNguyenNhanNgheo1NT,
      sumNguyenNhanNgheo2:
        data.sumNguyenNhanNgheo2TT + data.sumNguyenNhanNgheo2NT,
      sumNguyenNhanNgheo3:
        data.sumNguyenNhanNgheo3TT + data.sumNguyenNhanNgheo3NT,
      sumNguyenNhanNgheo4:
        data.sumNguyenNhanNgheo4TT + data.sumNguyenNhanNgheo4NT,
      sumNguyenNhanNgheo5:
        data.sumNguyenNhanNgheo5TT + data.sumNguyenNhanNgheo5NT,
      sumNguyenNhanNgheo6:
        data.sumNguyenNhanNgheo6TT + data.sumNguyenNhanNgheo6NT,
      sumNguyenNhanNgheo7:
        data.sumNguyenNhanNgheo7TT + data.sumNguyenNhanNgheo7NT,
      sumNguyenNhanNgheoKhac:
        data.sumNguyenNhanNgheoKhacTT + data.sumNguyenNhanNgheoKhacNT,
      arrKhuVucThanhThiV1: data.arrKhuVucThanhThiV1,
      arrKhuVucNongThonV1: data.arrKhuVucNongThonV1,
      ten_don_vi: data.tenDonVi,
      nam: currentYear,
      thang: currentMonth,
      ngay: currentDay,
    };
    const templateDataPath = path.join(
      __dirname,
      '../../public/uploads',
      'mau17.xlsx',
    );
    const templateData = fs.readFileSync(templateDataPath);
    const template = new XlsxTemplate(templateData);
    const sheetNumber = 1;
    template.substitute(sheetNumber, values);
    const outputData = template.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const outputFilePath = 'output.xlsx';
    fs.writeFileSync(outputFilePath, outputData, 'binary');
    const fileContent = fs.readFileSync(outputFilePath);

    return fileContent;
  }
}
