import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BangDanhSachDieuTra,
  BangDanhSachTaiLieu,
  BangThongTinChuHo,
  BangThongTinHo,
} from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IDanhSachDieuTra } from './danh-sach-dieu-tra';
//

@Injectable()
export class DanhSachDieuTraService implements IDanhSachDieuTra {
  constructor(
    @InjectRepository(BangDanhSachDieuTra)
    private readonly bangDanhSachDieuTraRepository: Repository<BangDanhSachDieuTra>,
    @InjectRepository(BangThongTinChuHo)
    private readonly bangThongTinChuHoRepository: Repository<BangThongTinChuHo>,
    @InjectRepository(BangThongTinHo)
    private readonly bangThongTinHoRepository: Repository<BangThongTinHo>,
    @InjectRepository(BangDanhSachTaiLieu)
    private readonly bangDanhSachTaiLieuRepository: Repository<BangDanhSachTaiLieu>,
  ) {}

  async getAllDanhSachDieuTra(queryParams) {
    // console.log('queryParams ở đây: ', queryParams);
    const page = queryParams.page;
    const pageSize = 5;

    const searchKey = queryParams.searchKey;
    const typeSort = queryParams.typeSort;
    const fieldSort = queryParams.fieldSort;
    const dotRaSoatID = queryParams.dotRaSoatID;
    const donViID = queryParams.donViID;

    const query = this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .leftJoinAndSelect('dieuTraRaSoat.CanBoID', 'canbo')
      .leftJoinAndSelect('dieuTraRaSoat.DonViID', 'donvi')
      .leftJoinAndSelect('dieuTraRaSoat.NguoiTaoID', 'nguoitao')
      .leftJoinAndSelect('dieuTraRaSoat.NguoiChinhSuaID', 'nguoichinhsua')
      .leftJoinAndSelect('dieuTraRaSoat.DotRaSoatID', 'dotrasoat')
      .andWhere('dotrasoat.IsRemoved = :IsRemoved', { IsRemoved: false });
    if (searchKey) {
      query.andWhere(
        'dieuTraRaSoat.TenDanhSach COLLATE utf8_general_ci LIKE :searchKey',
        {
          searchKey: `%${searchKey}%`,
        },
      );
    }

    if (typeSort && (typeSort === 'ASC' || typeSort === 'DESC')) {
      query.orderBy(`dieuTraRaSoat.${fieldSort}`, typeSort as 'ASC' | 'DESC');
    }

    if (Number(dotRaSoatID)) {
      query.andWhere('dotrasoat.DotRaSoatID = :DotRaSoatID', {
        DotRaSoatID: dotRaSoatID,
      });
    }

    if (Number(donViID)) {
      query.andWhere('donvi.DonViID = :DonViID', {
        DonViID: donViID,
      });
    }

    const queryCount = this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')

      .andWhere('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .leftJoinAndSelect('dieuTraRaSoat.CanBoID', 'canbo')
      .leftJoinAndSelect('dieuTraRaSoat.DonViID', 'donvi')
      .leftJoinAndSelect('dieuTraRaSoat.NguoiTaoID', 'nguoitao')
      .leftJoinAndSelect('dieuTraRaSoat.NguoiChinhSuaID', 'nguoichinhsua')
      .leftJoinAndSelect('dieuTraRaSoat.DotRaSoatID', 'dotrasoat')
      .andWhere('dotrasoat.IsRemoved = :IsRemoved', { IsRemoved: false });

    if (searchKey) {
      queryCount.andWhere('dieuTraRaSoat.TenDanhSach LIKE :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    }
    if (Number(dotRaSoatID)) {
      queryCount.andWhere('dotrasoat.DotRaSoatID = :DotRaSoatID', {
        DotRaSoatID: dotRaSoatID,
      });
    }

    if (Number(donViID)) {
      queryCount.andWhere('donvi.DonViID = :DonViID', {
        DonViID: donViID,
      });
    }
    const listDanhSachDieuTra = await query.getMany();
    const count = await queryCount.getCount();

    return {
      listDanhSachDieuTra,
      count,
    };
  }

  async getDetailDanhSachDieuTra(DanhSachID) {
    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: DanhSachID,
      })
      .leftJoinAndSelect('dieuTraRaSoat.DonViID', 'donvi')
      .getOne();
    const HoGiaDinhIDs = getDanhSachDieuTraID?.DanhSachHo || [];
    const TaiLieuIDS = getDanhSachDieuTraID?.DanhSachTL || [];
    const getHoGiaDinhByDanhSachDieuTra = HoGiaDinhIDs.length
      ? await this.bangThongTinHoRepository
          .createQueryBuilder('hoGiaDinh')
          .where('hoGiaDinh.HoGiaDinhID IN (:...ids)', { ids: HoGiaDinhIDs })
          .andWhere('hoGiaDinh.IsRemoved = :IsRemoved', { IsRemoved: false }) // Lọc hộ có IsRemoved là false
          .leftJoinAndSelect('hoGiaDinh.DonViID', 'donvi')
          .leftJoinAndSelect('hoGiaDinh.KhuVucRaSoatID', 'khuvuc')
          .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanloai')
          .getMany()
      : [];

    for (const item of getHoGiaDinhByDanhSachDieuTra) {
      const hoGiaDinhID = item.HoGiaDinhID;
      const result = await this.bangThongTinChuHoRepository
        .createQueryBuilder('chuHo')
        .where('chuHo.IsRemoved = :isRemoved', { isRemoved: false })
        .andWhere('chuHo.HoGiaDinhID = :hoGiaDinhID', { hoGiaDinhID })
        .getOne();
      item['ChuHo'] = result;
    }
    const getTaiLieuByDanhSachDieuTra = TaiLieuIDS.length
      ? await this.bangDanhSachTaiLieuRepository
          .createQueryBuilder('tailieu')
          .where('tailieu.TaiLieuID IN (:...ids)', { ids: TaiLieuIDS })
          .andWhere('tailieu.IsRemoved = :IsRemoved', { IsRemoved: false })
          .leftJoinAndSelect('tailieu.NguoiTaoID', 'nguoiTao')
          .leftJoinAndSelect('tailieu.NguoiChinhSuaID', 'nguoiChinhSuaID')
          .leftJoinAndSelect('tailieu.LoaiTaiLieu', 'loaiTaiLieu')
          .getMany()
      : [];

    return {
      getDanhSachDieuTraID,
      getHoGiaDinhByDanhSachDieuTra,
      getTaiLieuByDanhSachDieuTra,
    };
  }

  async getDanhSachDieuTraByID(DanhSachID) {
    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: DanhSachID,
      })
      .leftJoinAndSelect('dieuTraRaSoat.DonViID', 'donvi')
      .leftJoinAndSelect('dieuTraRaSoat.NguoiChinhSuaID', 'nguoichinhsua')
      .getOne();
    return getDanhSachDieuTraID;
  }

  async getPhanLoaiHo(DanhSachID) {
    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: DanhSachID,
      })
      .getOne();
    const HoGiaDinhIDs = getDanhSachDieuTraID?.DanhSachHo || [];
    const getHoGiaDinhByDanhSachDieuTra = HoGiaDinhIDs.length
      ? await this.bangThongTinHoRepository
          .createQueryBuilder('hoGiaDinh')
          .where('hoGiaDinh.HoGiaDinhID IN (:...ids)', { ids: HoGiaDinhIDs })
          .andWhere('hoGiaDinh.IsRemoved = :IsRemoved', { IsRemoved: false }) // Lọc hộ có IsRemoved là false
          .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanloai')
          .getMany()
      : [];

    for (const item of getHoGiaDinhByDanhSachDieuTra) {
      const hoGiaDinhID = item.HoGiaDinhID;
      const result = await this.bangThongTinChuHoRepository
        .createQueryBuilder('chuHo')
        .where('chuHo.IsRemoved = :isRemoved', { isRemoved: false })
        .andWhere('chuHo.HoGiaDinhID = :hoGiaDinhID', { hoGiaDinhID })
        .getOne();
      item['ChuHo'] = result;
    }

    return {
      getDanhSachDieuTraID,
      getHoGiaDinhByDanhSachDieuTra,
    };
  }

  async getDanhSachHoByDotRaSoatID(DotRaSoatID) {
    const danhSachDieuTra = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('danhSachDieuTra')
      .where('danhSachDieuTra.DotRaSoatID = :DotRaSoatID', { DotRaSoatID })
      .andWhere('danhSachDieuTra.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getOne();
    const HoGiaDinhIDs = danhSachDieuTra?.DanhSachHo || [];
    const getHoGiaDinhByDanhSachDieuTra = HoGiaDinhIDs.length
      ? await this.bangThongTinHoRepository
          .createQueryBuilder('hoGiaDinh')
          .where('hoGiaDinh.HoGiaDinhID IN (:...ids)', { ids: HoGiaDinhIDs })
          .andWhere('hoGiaDinh.IsRemoved = :IsRemoved', { IsRemoved: false }) // Lọc hộ có IsRemoved là false
          .leftJoinAndSelect('hoGiaDinh.DonViID', 'donvi')
          .leftJoinAndSelect('hoGiaDinh.KhuVucRaSoatID', 'khuvuc')
          .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanloai')
          .getMany()
      : [];

    for (const item of getHoGiaDinhByDanhSachDieuTra) {
      const hoGiaDinhID = item.HoGiaDinhID;
      const result = await this.bangThongTinChuHoRepository
        .createQueryBuilder('chuHo')
        .where('chuHo.IsRemoved = :isRemoved', { isRemoved: false })
        .andWhere('chuHo.HoGiaDinhID = :hoGiaDinhID', { hoGiaDinhID })
        .getOne();
      item['ChuHo'] = result;
    }
    return {
      danhSachDieuTra,
      getHoGiaDinhByDanhSachDieuTra,
    };
  }

  async getDanhSachTaiLieuTheoDot(DotRaSoatID) {
    const danhSachDieuTra = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('danhSachDieuTra')
      .where('danhSachDieuTra.DotRaSoatID = :DotRaSoatID', { DotRaSoatID })
      .andWhere('danhSachDieuTra.IsRemoved = :IsRemoved', { IsRemoved: false })
      .leftJoinAndSelect('danhSachDieuTra.CanBoID', 'canbo')
      .leftJoinAndSelect('danhSachDieuTra.NguoiTaoID', 'nguoitao')
      .leftJoinAndSelect('danhSachDieuTra.NguoiChinhSuaID', 'nguoichinhsua')
      .leftJoinAndSelect('danhSachDieuTra.DotRaSoatID', 'dotrasoat')
      .leftJoinAndSelect('danhSachDieuTra.DonViID', 'donvi')
      .getMany();
    return danhSachDieuTra;
  }

  async getDanhSachHoTrongDanhSachDieuTra(DanhSachID) {
    // console.log('DanhSachID: ', DanhSachID);
  }

  async editDanhSachDieuTra(danhSachDieuTraEdit) {
    // console.log('danh sach dieu tra: ', danhSachDieuTraEdit);
    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: danhSachDieuTraEdit.DanhSachID,
      })
      .getOne();
    getDanhSachDieuTraID.TenDanhSach = danhSachDieuTraEdit.TenDanhSach;
    getDanhSachDieuTraID.NguoiChinhSuaID = danhSachDieuTraEdit.NguoiChinhSuaID;
    getDanhSachDieuTraID.DotRaSoatID = danhSachDieuTraEdit.DotRaSoatID;
    getDanhSachDieuTraID.CanBoID = danhSachDieuTraEdit.CanBoID;
    getDanhSachDieuTraID.ThoiGianCapNhat = new Date();
    const saveDanhSachDieuTra = await this.bangDanhSachDieuTraRepository.save(
      getDanhSachDieuTraID,
    );
    return saveDanhSachDieuTra;
  }

  async updateStatusDanhSachDieuTra(danhSachDieuTraEditStatus) {
    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: danhSachDieuTraEditStatus.DanhSachID,
      })
      .getOne();
    // console.log('danhSachDieuTraEditStatus: ', danhSachDieuTraEditStatus);
    getDanhSachDieuTraID.Status = danhSachDieuTraEditStatus.Status;
    const saveDanhSachDieuTra = await this.bangDanhSachDieuTraRepository.save(
      getDanhSachDieuTraID,
    );
    return saveDanhSachDieuTra;
  }

  async updateDanhSachHoTrongDanhSachDieuTra(dataDanhSach) {
    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: dataDanhSach.DanhSachID,
      })
      .getOne();
    const HoGiaDinhIDs = getDanhSachDieuTraID.DanhSachHo;

    const mergedArray = [
      ...new Set([...HoGiaDinhIDs, ...dataDanhSach.DanhSachHo]),
    ];

    getDanhSachDieuTraID.DanhSachHo = mergedArray;
    const updatedDanhSachDieuTra =
      await this.bangDanhSachDieuTraRepository.save(getDanhSachDieuTraID);
    return updatedDanhSachDieuTra;
  }

  async updateDanhSachTaiLieuTrongDanhSachDieuTra(dataDanhSach) {
    // console.log('dataDanhSach: ', dataDanhSach);

    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: dataDanhSach.DanhSachID,
      })
      .getOne();
    const HoGiaDinhIDs = getDanhSachDieuTraID.DanhSachTL
      ? getDanhSachDieuTraID.DanhSachTL
      : [];

    const mergedArray = [
      ...new Set([...HoGiaDinhIDs, ...dataDanhSach.DanhSachTL]),
    ];

    getDanhSachDieuTraID.DanhSachTL = mergedArray;
    const updatedDanhSachDieuTra =
      await this.bangDanhSachDieuTraRepository.save(getDanhSachDieuTraID);
    return updatedDanhSachDieuTra;
  }

  async deleteDanhSachHoTrongDanhSachDieuTra(DanhSachID, DanhSachHo) {
    // console.log('DanhSachHo: ', DanhSachHo);

    const getDanhSachDieuTraID = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dieuTraRaSoat')
      .where('dieuTraRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dieuTraRaSoat.DanhSachID = :id', {
        id: DanhSachID,
      })
      .getOne();
    getDanhSachDieuTraID.DanhSachHo = DanhSachHo;
    const updatedDanhSachDieuTra =
      await this.bangDanhSachDieuTraRepository.save(getDanhSachDieuTraID);
    return updatedDanhSachDieuTra;
  }

  async createDanhSachDieuTra(danhSachDieuTra) {
    const newDanhSachDieuTra = await this.bangDanhSachDieuTraRepository.create(
      danhSachDieuTra,
    );
    const saved = await this.bangDanhSachDieuTraRepository.save(
      newDanhSachDieuTra,
    );
    return saved;
  }

  async deleteOneDanhSachDieuTra(DanhSachID) {
    const getDanhSach = await this.bangDanhSachDieuTraRepository.findOne(
      DanhSachID,
    );
    if (getDanhSach) {
      getDanhSach.IsRemoved = true;
      const saved = await this.bangDanhSachDieuTraRepository.save(getDanhSach);
      return saved;
    }
  }

  async deleteManyDanhSachDieuTra(DanhSachID) {
    const updatedQuery = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder()
      .update(BangDanhSachDieuTra);
    updatedQuery.set({ IsRemoved: true }).whereInIds(DanhSachID).execute();
  }

  async getStatusDotRaSoat() {
    const result = await this.bangDanhSachDieuTraRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dotRaSoat.Status = :Status', { Status: 'Hoàn thành ĐT,RS' })
      .getMany();
    return result;
  }
}
