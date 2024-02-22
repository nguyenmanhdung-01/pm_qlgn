import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangChiTieuB1 } from '../utils/typeorm';
import { CreatePhieuB1Details, editB1 } from '../utils/types';
import { IPB1Service } from './b1';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class B1Service implements IPB1Service {
  constructor(
    @InjectRepository(BangChiTieuB1)
    private readonly b1Repository: Repository<BangChiTieuB1>,
  ) {}

  async create(createDetails: CreatePhieuB1Details) {
    const existing = await this.b1Repository.find({
      TenChiTieuB1: createDetails.TenChiTieuB1,
    });

    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Chỉ tiêu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.b1Repository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.b1Repository.findOne({
      where: { ChiTieuB1ID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Chỉ tiêu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangChiTieuB1[]> {
    const results = await this.b1Repository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editB1): Promise<BangChiTieuB1> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenChiTieuB1 === editData.TenChiTieuB1.trim(),
    );
    if (!existingNN || result?.TenChiTieuB1 === editData?.TenChiTieuB1) {
      await this.b1Repository.update(id, editData);
      return result;
    } else {
      throw new HttpException('Chỉ tiêu đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangChiTieuB1[]> {
    await this.b1Repository
      .createQueryBuilder()
      .update(BangChiTieuB1)
      .set({ IsRemoved: true })
      .where('ChiTieuB1ID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.b1Repository.find();
    return dantoc;
  }
}
