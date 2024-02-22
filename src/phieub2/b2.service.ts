import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangChiTieuB2 } from '../utils/typeorm';
import { CreatePhieuB2Details, editB2 } from '../utils/types';
import { IPB2Service } from './b2';

@Injectable()
export class B2Service implements IPB2Service {
  constructor(
    @InjectRepository(BangChiTieuB2)
    private readonly b2Repository: Repository<BangChiTieuB2>,
  ) {}

  async create(createDetails: CreatePhieuB2Details) {
    const existing = await this.b2Repository.find({
      TenChiTieuB2: createDetails.TenChiTieuB2,
    });

    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Chỉ tiêu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.b2Repository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.b2Repository.findOne({
      where: { ChiTieuB2ID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Chỉ tiêu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangChiTieuB2[]> {
    const results = await this.b2Repository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editB2): Promise<BangChiTieuB2> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenChiTieuB2 === editData.TenChiTieuB2.trim(),
    );
    console.log('existingNN', existingNN);
    console.log('result', result);

    if (!existingNN || result?.TenChiTieuB2 === editData?.TenChiTieuB2) {
      await this.b2Repository.update(id, editData);
      return result;
    } else {
      throw new HttpException('Chỉ tiêu đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangChiTieuB2[]> {
    await this.b2Repository
      .createQueryBuilder()
      .update(BangChiTieuB2)
      .set({ IsRemoved: true })
      .where('ChiTieuB2ID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.b2Repository.find();
    return dantoc;
  }
}
