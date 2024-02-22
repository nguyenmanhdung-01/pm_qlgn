import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangDanhSachBieuMau } from '../utils/typeorm';
import { CreateBieuMauDetails, editBieuMau } from '../utils/types';
import { IBieuMauService } from './bieumau';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class BieuMauService implements IBieuMauService {
  constructor(
    @InjectRepository(BangDanhSachBieuMau)
    private readonly bieumauRepository: Repository<BangDanhSachBieuMau>,
  ) {}

  async create(createDetails: CreateBieuMauDetails) {
    const existing = await this.bieumauRepository.find({
      TenBieuMau: createDetails.TenBieuMau,
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Biểu mẫu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.bieumauRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.bieumauRepository.findOne({
      where: { BieuMauID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Biểu mẫu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<any> {
    const pageNumber = parseInt(offset);

    const pageSize = parseInt(limit);
    const queryBuilder = await this.bieumauRepository
      .createQueryBuilder('bieumau')
      .leftJoinAndSelect('bieumau.LoaiBieuMau', 'loaibieumau')
      .where('bieumau.IsRemoved = :isRemoved', { isRemoved: false });

    if (!isNaN(pageNumber) && !isNaN(pageSize)) {
      console.log('pageNumber', pageNumber);

      const offsetValue = (pageNumber - 1) * pageSize;

      queryBuilder.skip(offsetValue).take(pageSize);
    }

    if (
      search?.length !== 0 &&
      search?.length !== undefined &&
      search !== 'undefined'
    ) {
      console.log('search2', search);

      queryBuilder.andWhere('bieumau.TenBieuMau LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (orderByParam === 'LoaiBieuMau') {
      queryBuilder.orderBy(
        'bieumau.LoaiBieuMau',
        desc === 'true' ? 'ASC' : 'DESC',
      );
    } else if (orderByParam === 'TenBieuMau') {
      queryBuilder.orderBy(
        'bieumau.TenBieuMau',
        desc === 'true' ? 'ASC' : 'DESC',
      );
    }
    const results = await queryBuilder.getMany();
    return results;
  }

  async edit(id: number, editData: editBieuMau): Promise<BangDanhSachBieuMau> {
    await this.bieumauRepository.update(id, editData);
    const result = await this.findById(id);
    return result;
  }

  async delete(idDelete: number[]): Promise<BangDanhSachBieuMau[]> {
    await this.bieumauRepository
      .createQueryBuilder()
      .update(BangDanhSachBieuMau)
      .set({ IsRemoved: true })
      .where('BieuMauID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.bieumauRepository.find();
    return dantoc;
  }
}
