import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BangLoaiDotRaSoat } from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoaiDotRaSoatService {
  constructor(
    @InjectRepository(BangLoaiDotRaSoat)
    private readonly bangLoaiDotRaSoatRepository: Repository<BangLoaiDotRaSoat>,
  ) {}

  async getAllLoaiDotRaSoat() {
    const listLoaiDotRaSoat = await this.bangLoaiDotRaSoatRepository.find();
    return listLoaiDotRaSoat;
  }

  async getOneLoaiDotRaSoat(LoaiDotRaSoatID: number) {
    const loaiDotRaSoat = await this.bangLoaiDotRaSoatRepository
      .createQueryBuilder('loaiDotRaSoat')
      .where('loaiDotRaSoat.LoaiDotRaSoatID = :id', { id: LoaiDotRaSoatID })
      .getOne();
    return loaiDotRaSoat;
  }
}
