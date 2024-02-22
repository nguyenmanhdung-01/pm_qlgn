import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangPhanLoaiHo, BangTinh } from '../utils/typeorm';
import { CreatePLHoDetails, editPLHo } from '../utils/types';
import { IPLHoService } from './plho';
import { Services } from 'src/utils/constants';
import { IVungService } from 'src/vung/vung';

// import { IRoleService } from 'src/role/role';

@Injectable()
export class PLHoService implements IPLHoService {
  constructor(
    @InjectRepository(BangPhanLoaiHo)
    private readonly plhoRepository: Repository<BangPhanLoaiHo>,
  ) {}

  async create(createDetails: CreatePLHoDetails) {
    const existing = await this.plhoRepository.find({
      TenLoai: createDetails.TenLoai,
    });

    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Loại hộ đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.plhoRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.plhoRepository.findOne({
      where: { PhanLoaiHoID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Hộ gia đình with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangPhanLoaiHo[]> {
    const results = await this.plhoRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editPLHo): Promise<BangPhanLoaiHo> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenLoai === editData.TenLoai.trim(),
    );
    if (!existingNN) {
      await this.plhoRepository.update(id, editData);
      return result;
    } else {
      throw new HttpException('Loại hộ đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangPhanLoaiHo[]> {
    await this.plhoRepository
      .createQueryBuilder()
      .update(BangPhanLoaiHo)
      .set({ IsRemoved: true })
      .where('PhanLoaiHoID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.plhoRepository.find();
    return dantoc;
  }
}
