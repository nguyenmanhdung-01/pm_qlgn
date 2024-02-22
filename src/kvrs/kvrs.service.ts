import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BangDotRaSoat,
  BangKhuVucRaSoat,
  BangPhanLoaiHo,
  BangTinh,
} from '../utils/typeorm';
import { CreateKVRSDetails, editKVRS } from '../utils/types';
import { IKVRSService } from './kvrs';
import { Services } from 'src/utils/constants';
import { IVungService } from 'src/vung/vung';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class KVRSService implements IKVRSService {
  constructor(
    @InjectRepository(BangKhuVucRaSoat)
    private readonly kvrsRepository: Repository<BangKhuVucRaSoat>,
    @InjectRepository(BangDotRaSoat)
    private readonly drsRepository: Repository<BangDotRaSoat>,
  ) {}

  async create(createDetails: CreateKVRSDetails) {
    const existing = await this.kvrsRepository.find({
      TenKhuVuc: createDetails.TenKhuVuc,
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException(
        'Khu vực rà soát đã tồn tại',
        HttpStatus.CONFLICT,
      );

    const saved = await this.kvrsRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.kvrsRepository.findOne({
      where: { KhuVucRaSoatID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Khu vực with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangKhuVucRaSoat[]> {
    const results = await this.kvrsRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }
  async getAllDRS(): Promise<BangDotRaSoat[]> {
    const results = await this.drsRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editKVRS): Promise<BangKhuVucRaSoat> {
    const resultAll = await this.getAll();
    const result = await this.findById(id);
    const existingNN = resultAll?.find(
      (x) => x.TenKhuVuc === editData.TenKhuVuc.trim(),
    );
    if (!existingNN) {
      await this.kvrsRepository.update(id, editData);
      return result;
    } else {
      throw new HttpException('KVRS đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangKhuVucRaSoat[]> {
    await this.kvrsRepository
      .createQueryBuilder()
      .update(BangKhuVucRaSoat)
      .set({ IsRemoved: true })
      .where('KhuVucRaSoatID IN (:...ids)', { ids: idDelete })
      .execute();
    const result = await this.kvrsRepository.find();
    return result;
  }
}
