import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangNgheNghiep } from '../utils/typeorm';
import { CreateNgheNghiepDetails, editNgheNghiep } from '../utils/types';
import { INgheNghiepService } from './nghenghiep';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class NgheNghiepService implements INgheNghiepService {
  constructor(
    @InjectRepository(BangNgheNghiep)
    private readonly nghenghiepRepository: Repository<BangNgheNghiep>,
  ) {}

  async create(createDetails: CreateNgheNghiepDetails) {
    const existing = await this.nghenghiepRepository.find({
      TenNgheNghiep: createDetails.TenNgheNghiep,
    });

    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Nghề nghiệp đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.nghenghiepRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.nghenghiepRepository.findOne({
      where: { NgheNghiepID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Nghề nghiệp with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangNgheNghiep[]> {
    const results = await this.nghenghiepRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editNgheNghiep): Promise<BangNgheNghiep> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenNgheNghiep === editData.TenNgheNghiep.trim(),
    );
    if (!existingNN) {
      await this.nghenghiepRepository.update(id, editData);
      return result;
    } else {
      throw new HttpException('Nghề nghiệp đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangNgheNghiep[]> {
    await this.nghenghiepRepository
      .createQueryBuilder()
      .update(BangNgheNghiep)
      .set({ IsRemoved: true })
      .where('NgheNghiepID IN (:...ids)', { ids: idDelete })
      .execute();
    const result = await this.nghenghiepRepository.find();
    return result;
  }
}
