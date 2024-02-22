import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangDonVi } from '../utils/typeorm';
import {
  CreateDonviDetails,
  editDonVi,
  editHuyen,
  findByID,
} from '../utils/types';
import { IDonViService } from './donvi';

@Injectable()
export class DonViService implements IDonViService {
  constructor(
    @InjectRepository(BangDonVi)
    private readonly donviRepository: Repository<BangDonVi>,
  ) {}

  async create(createDetails: CreateDonviDetails) {
    const existing = await this.donviRepository.find({
      TenDonVi: createDetails.TenDonVi,
    });
    const validate = existing.find((x) => x.IsRemoved === false);

    if (validate)
      throw new HttpException('Đơn vị đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.donviRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.donviRepository.findOne({
      where: { DonViID: id, IsRemoved: false },
      relations: ['Vung', 'Tinh', 'Huyen', 'Xa'],
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Đơn vị with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findByListID(id: findByID) {
    console.log('id', id);

    const result = await this.donviRepository
      .createQueryBuilder('donvi')
      .where('donvi.VungID = :value1', { value1: id.VungID })
      .andWhere('donvi.TinhID = :value2', { value2: id.TinhID })
      .andWhere('donvi.HuyenID = :value3', { value3: id.HuyenID })
      .andWhere('donvi.XaID = :value4', { value4: id.XaID })
      .getMany(); // Lấy tất cả các kết quả thỏa mãn điều kiện
    if (result) {
      return result;
    }
    throw new HttpException(
      'Đơn vị with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }> {
    const pageNumber = parseInt(offset);
    const pageSize = parseInt(limit);
    const queryBuilder = await this.donviRepository
      .createQueryBuilder('donvi')
      .leftJoinAndSelect('donvi.Vung', 'vung')
      .leftJoinAndSelect('donvi.Tinh', 'tinh')
      .leftJoinAndSelect('donvi.Huyen', 'huyen')
      .leftJoinAndSelect('donvi.Xa', 'xa')
      .where('donvi.IsRemoved = :isRemoved', { isRemoved: false });

    if (!isNaN(pageNumber) && !isNaN(pageSize)) {
      const offsetValue = (pageNumber - 1) * pageSize;
      queryBuilder.skip(offsetValue).take(pageSize);
    }

    if (
      search?.length !== 0 &&
      search?.length !== undefined &&
      search !== 'undefined'
    ) {
      queryBuilder.andWhere('donvi.TenDonVi LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (orderByParam === 'DonViID') {
      queryBuilder.orderBy('donvi.DonViID', desc === 'true' ? 'ASC' : 'DESC');
    } else if (orderByParam === 'TenDonVi') {
      queryBuilder.orderBy('donvi.TenDonVi', desc === 'true' ? 'ASC' : 'DESC');
    }

    const results = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();
    return { data: results, toltal: count };
  }

  async edit(id: number, editData: editDonVi): Promise<BangDonVi> {
    await this.donviRepository.update(id, editData);
    const result = await this.findById(id);
    return result;
  }

  async delete(idDelete: number[]): Promise<BangDonVi[]> {
    await this.donviRepository
      .createQueryBuilder()
      .update(BangDonVi)
      .set({ IsRemoved: true })
      .where('DonViID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.donviRepository.find();
    return dantoc;
  }
}
