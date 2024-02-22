import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IDotRaSoat } from './dot-ra-soat';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BangDanhSachDieuTra,
  BangDotRaSoat,
  MappingDotRaSoatVaTaiLieuLienQuan,
} from 'src/utils/typeorm';

@Injectable()
export class DotRaSoatService implements IDotRaSoat {
  constructor(
    @InjectRepository(BangDotRaSoat)
    private readonly bangDotRaSoatRepository: Repository<BangDotRaSoat>,
    @InjectRepository(BangDanhSachDieuTra)
    private readonly bangDanhSachDieuTraRepository: Repository<BangDanhSachDieuTra>,
    @InjectRepository(MappingDotRaSoatVaTaiLieuLienQuan)
    private readonly bangMappingDotRaSoatVaTaiLieuLienQuanRepository: Repository<MappingDotRaSoatVaTaiLieuLienQuan>,
  ) {}

  async getAllDotRaSoat(queryParams) {
    const page = queryParams.page;
    const pageSize = 5;

    const searchKey = queryParams.searchKey;
    const typeSort = queryParams.typeSort;
    const fieldSort = queryParams.fieldSort;
    const loaiDotRaSoatID = queryParams.loaiDotRaSoatID;
    const ngayBatDau = String(queryParams.dateStart);

    const ngayKetThuc = queryParams.dateEnd;
    // console.log('typeSort: ', typeSort);
    // console.log('queryParams: ', queryParams);

    const query = this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .leftJoinAndSelect('dotRaSoat.LoaiDotRaSoatID', 'loaiDotRaSoat')
      .leftJoinAndSelect('dotRaSoat.Creator', 'user')
      .leftJoinAndSelect('dotRaSoat.LastEditor', 'lastEditor');

    if (searchKey) {
      // query.andWhere('dotRaSoat.TenDotRaSoat LIKE :searchKey', {
      //   searchKey: `%${searchKey}%`,
      // });
      query.andWhere('dotRaSoat.TenDotRaSoat LIKE :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    }

    if (typeSort && (typeSort === 'ASC' || typeSort === 'DESC')) {
      query.orderBy(`dotRaSoat.${fieldSort}`, typeSort as 'ASC' | 'DESC');
    }

    if (Number(loaiDotRaSoatID)) {
      query.andWhere('loaiDotRaSoat.LoaiDotRaSoatID = :LoaiDotRaSoatID', {
        LoaiDotRaSoatID: loaiDotRaSoatID,
      });
    }

    if (ngayBatDau) {
      // console.log('ngayBatDau: ', ngayBatDau);
      query.andWhere('DATE(dotRaSoat.DateCreated) >= :ngayBatDau', {
        ngayBatDau,
      });
    }

    if (ngayKetThuc) {
      query.andWhere('DATE(dotRaSoat.DateCreated) <= :ngayKetThuc', {
        ngayKetThuc,
      });
    }

    const queryCount = this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .leftJoinAndSelect('dotRaSoat.LoaiDotRaSoatID', 'loaiDotRaSoat')
      .leftJoinAndSelect('dotRaSoat.Creator', 'user')
      .leftJoinAndSelect('dotRaSoat.LastEditor', 'lastEditor');

    if (searchKey) {
      queryCount.andWhere('dotRaSoat.TenDotRaSoat LIKE :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    }

    if (typeSort && (typeSort === 'ASC' || typeSort === 'DESC')) {
      queryCount.orderBy(`dotRaSoat.${fieldSort}`, typeSort as 'ASC' | 'DESC');
    }

    if (loaiDotRaSoatID) {
      queryCount.andWhere('loaiDotRaSoat.LoaiDotRaSoatID = :LoaiDotRaSoatID', {
        LoaiDotRaSoatID: loaiDotRaSoatID,
      });
    }

    if (ngayBatDau) {
      queryCount.andWhere('DATE(dotRaSoat.DateCreated) >= :ngayBatDau', {
        ngayBatDau,
      });
    }

    if (ngayKetThuc) {
      queryCount.andWhere('DATE(dotRaSoat.DateCreated) <= :ngayKetThuc', {
        ngayKetThuc,
      });
    }
    const dotRaSoat = await query.getMany();
    for (const item of dotRaSoat) {
      // console.log('item: ', item);
      const DotRaSoatID = item.DotRaSoatID;
      const danhSachDieuTra = await this.bangDanhSachDieuTraRepository
        .createQueryBuilder('danhSachDieuTra')
        .select(['danhSachDieuTra.Status'])
        .where('danhSachDieuTra.DotRaSoatID = :DotRaSoatID', { DotRaSoatID })
        .andWhere('danhSachDieuTra.IsRemoved = :IsRemoved', {
          IsRemoved: false,
        })
        .getMany();
      if (!danhSachDieuTra.length) {
        item['Status'] = 'Đang chờ';
      } else {
        if (danhSachDieuTra.some((item) => item.Status === 'Đang chờ ĐT,RS')) {
          item['Status'] = 'Đang chờ';
        } else if (
          danhSachDieuTra.some(
            (item) => item.Status === 'Đang thực hiện ĐT, RS',
          )
        ) {
          item['Status'] = 'Đang thực hiện';
        } else {
          item['Status'] = 'Hoàn thành';
        }
        // await this.bangDotRaSoatRepository.save(danhSachDieuTra);
        // item['statusDanhSachTrongDot'] = danhSachDieuTra;
      }
      const dotRaSoatStatus = {
        DotRaSoatID: DotRaSoatID,
        Status: item['Status'],
      };
      await this.updateStatusDotRaSoat(dotRaSoatStatus);
      // danhSachDieuTra.map((danhSachItem) => console.log(danhSachItem));
      // item['statusDanhSachTrongDot'] = danhSachDieuTra;
      // console.log('danhSachDieuTra: ', danhSachDieuTra);
    }
    const count = await queryCount.getCount();
    return { dotRaSoat, count };
  }

  async getDotRaSoatNoQuery() {
    const result = await this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();
    return result;
  }

  async getOneDotRaSoat(DotRaSoatID) {
    // console.log('DotRaSoatID: ', DotRaSoatID);

    const checkExisDotRaSoat = await this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :id', {
        id: DotRaSoatID,
      })
      .leftJoinAndSelect('dotRaSoat.LoaiDotRaSoatID', 'loaiDotRaSoat')
      .leftJoinAndSelect('dotRaSoat.Creator', 'user')
      .leftJoinAndSelect('dotRaSoat.LastEditor', 'lastEditor')
      .getOne();
    return checkExisDotRaSoat;
  }

  async updateStatusDotRaSoat(dotRaSoatStatus) {
    // console.log('dotRaSoatStatus: ', dotRaSoatStatus);

    const getDotRaSoatByID = await this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dotRaSoat.DotRaSoatID = :id', {
        id: dotRaSoatStatus.DotRaSoatID,
      })
      .getOne();
    // console.log('getDotRaSoatByID: ', getDotRaSoatByID);
    getDotRaSoatByID.Status = dotRaSoatStatus.Status;
    const save = await this.bangDotRaSoatRepository.save(getDotRaSoatByID);
    return save;
  }

  async getStatusDotRaSoat() {
    const result = await this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('dotRaSoat.Status = :Status', { Status: 'Hoàn thành' })
      .getMany();
    return result;
  }

  async createDotRaSoat(dotRaSoat) {
    const findDotRaSoatByTen = await this.bangDotRaSoatRepository.findOne({
      where: {
        TenDotRaSoat: dotRaSoat.TenDotRaSoat,
      },
    });
    // console.log(findDotRaSoatByTen);

    if (findDotRaSoatByTen) {
      throw new HttpException(
        'Tên đợt rà soát đã tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const newDotRaSoat = await this.bangDotRaSoatRepository.create(dotRaSoat);
    const savedDotRaSoat = await this.bangDotRaSoatRepository.save(
      newDotRaSoat,
    );

    return savedDotRaSoat;
  }

  async createTaiLieuTrongDotRaSoat(idDotRaSoat, idTaiLieu) {
    const createTaiLieuVaDotDieuTra =
      await this.bangMappingDotRaSoatVaTaiLieuLienQuanRepository.create({
        DotRaSoatID: idDotRaSoat,
        TaiLieuID: idTaiLieu,
      });
    const saved =
      await this.bangMappingDotRaSoatVaTaiLieuLienQuanRepository.save(
        createTaiLieuVaDotDieuTra,
      );
    return saved;
  }

  async editDotRaSoat(dotRaSoat) {
    // console.log('dotRaSoat: ', dotRaSoat);

    // const findDotRaSoatByTen = await this.bangDotRaSoatRepository.findOne({
    //   where: {
    //     TenDotRaSoat: dotRaSoat.TenDotRaSoat,
    //   },
    // });

    // if (findDotRaSoatByTen) {
    //   throw new HttpException(
    //     'Tên đợt rà soát đã tồn tại',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    const checkExisDotRaSoat = await this.bangDotRaSoatRepository
      .createQueryBuilder('dotRaSoat')
      .where('dotRaSoat.DotRaSoatID = :id', {
        id: dotRaSoat.DotRaSoatID,
      })
      .getOne();
    if (!checkExisDotRaSoat) {
      throw new HttpException(
        'Khong tim thấy đợt rà soát này',
        HttpStatus.CONFLICT,
      );
    }
    checkExisDotRaSoat.TenDotRaSoat = dotRaSoat.TenDotRaSoat;
    checkExisDotRaSoat.StartDate = dotRaSoat.StartDate;
    checkExisDotRaSoat.EndDate = dotRaSoat.EndDate;
    checkExisDotRaSoat.LastEditor = dotRaSoat.LastEditor;
    checkExisDotRaSoat.LoaiDotRaSoatID = dotRaSoat.LoaiDotRaSoatID;
    const updatedDotRaSot = await this.bangDotRaSoatRepository.save(
      checkExisDotRaSoat,
    );
    return updatedDotRaSot;
  }

  async deleteOneDotRaSoat(DotRaSoatID) {
    const getHoGiaDinh = await this.bangDotRaSoatRepository.findOne(
      DotRaSoatID,
    );
    if (getHoGiaDinh) {
      getHoGiaDinh.IsRemoved = true;
      const saved = await this.bangDotRaSoatRepository.save(getHoGiaDinh);
      return saved;
    }
  }

  async deleteManyDotRaSoat(DotRaSoatIDs) {
    const updatedQuery = await this.bangDotRaSoatRepository
      .createQueryBuilder()
      .update(BangDotRaSoat);
    updatedQuery.set({ IsRemoved: true }).whereInIds(DotRaSoatIDs).execute();
  }
}
