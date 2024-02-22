import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITLNPLService } from './tlnpl';
import { CreateTLNPLDetails, editTLNPL } from 'src/utils/types';
import { BangThietLapNguongPL } from 'src/utils/typeorm';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class TLNPLService implements ITLNPLService {
  constructor(
    @InjectRepository(BangThietLapNguongPL)
    private readonly tlnplRepository: Repository<BangThietLapNguongPL>,
  ) {}

  async create(createDetails: CreateTLNPLDetails) {
    const existing = await this.tlnplRepository.findOne({
      TenNguong: createDetails.TenNguong,
    });

    if (existing)
      throw new HttpException('Chỉ tiêu đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.tlnplRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.tlnplRepository.findOne({
      where: { NguongID: id },
      relations: ['PhanLoaiHo', 'KhuVucRaSoat'],
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Chỉ tiêu with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangThietLapNguongPL[]> {
    const results = await this.tlnplRepository
      .createQueryBuilder('tlnpl')
      .leftJoinAndSelect('tlnpl.PhanLoaiHo', 'plho')
      .leftJoinAndSelect('tlnpl.KhuVucRaSoat', 'kvrs')
      .getMany();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editTLNPL): Promise<BangThietLapNguongPL> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenNguong === editData.TenNguong.trim(),
    );
    if (!existingNN) {
      await this.tlnplRepository.update(id, editData);
      return result;
    } else {
      throw new HttpException('TLNPM đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangThietLapNguongPL[]> {
    await this.tlnplRepository
      .createQueryBuilder()
      .update(BangThietLapNguongPL)
      .set({ IsRemoved: true })
      .where('NguongID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.tlnplRepository.find();
    return dantoc;
  }
}
