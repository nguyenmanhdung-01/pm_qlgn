import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangChinhSach } from '../utils/typeorm';
import {
  CreateChinhSachDetails,
  CreatePLTLDetails,
  editChinhSach,
  editPLTL,
} from '../utils/types';
import { IChinhSachService } from './chinhsach';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class ChinhSachService implements IChinhSachService {
  constructor(
    @InjectRepository(BangChinhSach)
    private readonly chinhsachRepository: Repository<BangChinhSach>,
  ) {}

  async create(createDetails: CreateChinhSachDetails) {
    const existing = await this.chinhsachRepository.find({
      TenChinhSach: createDetails.TenChinhSach,
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Loại tài liệu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.chinhsachRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.chinhsachRepository.findOne({
      where: { ChinhSachID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Loại tài liệu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangChinhSach[]> {
    const results = await this.chinhsachRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editChinhSach): Promise<BangChinhSach> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenChinhSach === editData.TenChinhSach.trim(),
    );
    if (!existingNN) {
      await this.chinhsachRepository.update(id, editData);
      return result;
    } else {
      throw new HttpException('Chính sách đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangChinhSach[]> {
    await this.chinhsachRepository
      .createQueryBuilder()
      .update(BangChinhSach)
      .set({ IsRemoved: true })
      .where('ChinhSachID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.chinhsachRepository.find();
    return dantoc;
  }
}
