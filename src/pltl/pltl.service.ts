import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangPhanLoaiTaiLieu } from '../utils/typeorm';
import { CreatePLTLDetails, editPLTL } from '../utils/types';
import { IPLTLService } from './pltl';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class PLTLService implements IPLTLService {
  constructor(
    @InjectRepository(BangPhanLoaiTaiLieu)
    private readonly pltlRepository: Repository<BangPhanLoaiTaiLieu>,
  ) {}

  async create(createDetails: CreatePLTLDetails) {
    const existing = await this.pltlRepository.find({
      TenLoaiTaiLieu: createDetails.TenLoaiTaiLieu,
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Loại tài liệu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.pltlRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.pltlRepository.findOne({
      where: { LoaiTaiLieuID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Loại tài liệu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangPhanLoaiTaiLieu[]> {
    const results = await this.pltlRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editPLTL): Promise<BangPhanLoaiTaiLieu> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenLoaiTaiLieu === editData.TenLoaiTaiLieu.trim(),
    );
    if (!existingNN) {
      await this.pltlRepository.update(id, editData);
      return result;
    } else {
      throw new HttpException('Loại tài liệu đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangPhanLoaiTaiLieu[]> {
    await this.pltlRepository
      .createQueryBuilder()
      .update(BangPhanLoaiTaiLieu)
      .set({ IsRemoved: true })
      .where('LoaiTaiLieuID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.pltlRepository.find();
    return dantoc;
  }
}
