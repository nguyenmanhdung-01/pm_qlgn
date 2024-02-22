import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { BangDanhSachTaiLieu } from '../utils/typeorm';
import { IBaoCaoService } from './baocao';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class BaoCaoService implements IBaoCaoService {
  constructor(
    @InjectRepository(BangDanhSachTaiLieu)
    private readonly tailieuRepository: Repository<BangDanhSachTaiLieu>,
  ) {}

  async getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
    exel: string,
  ): Promise<any> {
    const pageNumber = parseInt(offset);
    const pageSize = parseInt(limit);
    const queryBuilder = await this.tailieuRepository
      .createQueryBuilder('tailieu')
      .leftJoinAndSelect('tailieu.LoaiTaiLieu', 'loaibieumau')
      .leftJoinAndSelect('tailieu.DonViID', 'donvi')
      .where('tailieu.IsRemoved = :isRemoved', { isRemoved: false });

    if (!isNaN(pageNumber) && !isNaN(pageSize)) {
      const offsetValue = (pageNumber - 1) * pageSize;
      queryBuilder.skip(offsetValue).take(pageSize);
    }

    if (
      search?.length !== 0 &&
      search?.length !== undefined &&
      search !== 'undefined'
    ) {
      queryBuilder.andWhere('tailieu.TenTaiLieu LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Thêm điều kiện để chỉ lấy tệp Excel (có phần mở rộng .xls hoặc .xlsx)
    if (exel) {
      console.log('exel', exel);

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('tailieu.Url LIKE :excelExtensionXLS', {
            excelExtensionXLS: '%.xls',
          });
          qb.orWhere('tailieu.Url LIKE :excelExtensionXLSX', {
            excelExtensionXLSX: '%.xlsx',
          });
        }),
      );
    }

    if (orderByParam === 'LoaiTaiLieu') {
      queryBuilder.orderBy(
        'tailieu.LoaiTaiLieu',
        desc === 'true' ? 'ASC' : 'DESC',
      );
    } else if (orderByParam === 'TenTaiLieu') {
      queryBuilder.orderBy(
        'tailieu.TenTaiLieu',
        desc === 'true' ? 'ASC' : 'DESC',
      );
    }

    const results = await queryBuilder.getMany();
    return results;
  }

  async findById(id: number) {
    const result = await this.tailieuRepository.findOne({
      where: { TaiLieuID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Tài liệu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
