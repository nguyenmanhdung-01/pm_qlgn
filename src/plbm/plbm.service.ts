import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangLoaiBieuMau } from '../utils/typeorm';
import { CreatePLBMDetails, editPLBM } from '../utils/types';
import { IPLBMService } from './plbm';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class PLBMService implements IPLBMService {
  constructor(
    @InjectRepository(BangLoaiBieuMau)
    private readonly pltlRepository: Repository<BangLoaiBieuMau>,
  ) {}

  async create(createDetails: CreatePLBMDetails) {
    const existing = await this.pltlRepository.find({
      TenLoaiBieuMau: createDetails.TenLoaiBieuMau,
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Loại tài liệu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.pltlRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.pltlRepository.findOne({
      where: { LoaiBieuMauID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Loại tài liệu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangLoaiBieuMau[]> {
    const results = await this.pltlRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editPLBM): Promise<BangLoaiBieuMau> {
    await this.pltlRepository.update(id, editData);
    const result = await this.findById(id);
    return result;
  }

  async delete(idDelete: number[]): Promise<BangLoaiBieuMau[]> {
    await this.pltlRepository
      .createQueryBuilder()
      .update(BangLoaiBieuMau)
      .set({ IsRemoved: true })
      .where('LoaiBieuMauID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.pltlRepository.find();
    return dantoc;
  }
}
