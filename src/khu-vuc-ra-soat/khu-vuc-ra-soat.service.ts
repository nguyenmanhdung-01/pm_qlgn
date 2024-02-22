import { Injectable } from '@nestjs/common';
import { IKhuVucRaSoat } from './khu-vuc-ra-soat';
import { InjectRepository } from '@nestjs/typeorm';
import { BangKhuVucRaSoat } from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KhuVucRaSoatService implements IKhuVucRaSoat {
  constructor(
    @InjectRepository(BangKhuVucRaSoat)
    private readonly bangKhuVucRaSoatRepository: Repository<BangKhuVucRaSoat>,
  ) {}

  async getAllKhuVucRaSoat() {
    const listKhuVucRaSoat = await this.bangKhuVucRaSoatRepository.find();
    return listKhuVucRaSoat;
  }
}
