import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangDonVi, BangTinh, BangVung } from '../utils/typeorm';
import { CreateTinhDetails, editTinh } from '../utils/types';
import { ITinhService } from './tinh';
import { Services } from 'src/utils/constants';
import { IVungService } from 'src/vung/vung';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class TinhService implements ITinhService {
  constructor(
    @InjectRepository(BangTinh)
    private readonly tinhRepository: Repository<BangTinh>,

    @InjectRepository(BangVung)
    private readonly vungRepository: Repository<BangVung>,
  ) {}

  async create(createDetails: CreateTinhDetails) {
    const existing = await this.tinhRepository.find({
      TenTinh: createDetails.TenTinh.trim(),
    });
    console.log('existing', existing);

    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Tỉnh đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.tinhRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.tinhRepository.findOne({
      where: { TinhID: id, IsRemoved: false },
      relations: ['DonVi', 'Huyen', 'CanBo'],
    });
    if (result) {
      // Lọc danh sách huyện theo điều kiện IsRemoved === false
      result.Huyen = result.Huyen.filter((x) => !x.IsRemoved);
      return result;
    }

    throw new HttpException(
      'Tinh with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findDonViById(
    id: number,
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }> {
    const pageNumber = parseInt(offset);
    const pageSize = parseInt(limit);
    console.log('pageNumber', pageNumber);
    console.log('pageSize', pageSize);
    const queryBuilder = await this.tinhRepository
      .createQueryBuilder('tinh')
      .where('tinh.IsRemoved = :isRemoved', { isRemoved: false })
      .andWhere('tinh.TinhID = :id', { id });

    if (!isNaN(pageNumber) && !isNaN(pageSize)) {
      const offsetValue = (pageNumber - 1) * pageSize;
      queryBuilder
        .leftJoinAndSelect('tinh.DonVi', 'donvi')
        .skip(offsetValue)
        .take(pageSize);
      console.log('queryBuilder', queryBuilder);
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

    const results = await queryBuilder.getOne();
    return { data: results?.DonVi, toltal: results?.DonVi?.length };
  }

  async findChildrenByIdParent(id: number) {
    const result = await this.tinhRepository.find({
      where: { VungID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Tinh with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangTinh[]> {
    //
    const results = await this.tinhRepository
      .createQueryBuilder('tinh')
      .leftJoinAndSelect(
        'tinh.Huyen',
        'huyen',
        'huyen.IsRemoved = :IsRemoved',
        {
          IsRemoved: false,
        },
      )
      .where('tinh.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();

    return results;
  }

  async edit(id: number, editData: editTinh): Promise<BangTinh> {
    const existingVung = await this.vungRepository
      .createQueryBuilder('vung')
      .leftJoinAndSelect('vung.Tinh', 'tinh', 'tinh.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .where('vung.VungID = :id', { id: editData.VungID })
      .getOne();
    const existingTinh = existingVung?.Tinh?.find(
      (x) => x.TenTinh === editData.TenTinh.trim(),
    );
    console.log('existingVung', existingVung);
    console.log('existingTinh', existingTinh);

    if (!existingTinh) {
      await this.tinhRepository.update(id, editData);
      const result = await this.findById(id);
      return result;
    } else {
      throw new HttpException('Tỉnh đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangTinh[]> {
    await this.tinhRepository
      .createQueryBuilder()
      .update(BangTinh)
      .set({ IsRemoved: true })
      .where('TinhID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.tinhRepository.find();
    return dantoc;
  }
}
