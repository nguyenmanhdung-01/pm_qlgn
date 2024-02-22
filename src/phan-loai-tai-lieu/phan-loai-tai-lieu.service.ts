import { Injectable } from '@nestjs/common';
import { IPhanLoaiTaiLieu } from './phan-loai-tai-lieu';
import { InjectRepository } from '@nestjs/typeorm';

import { BangPhanLoaiTaiLieu } from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PhanLoaiTaiLieuService implements IPhanLoaiTaiLieu {
  constructor(
    @InjectRepository(BangPhanLoaiTaiLieu)
    private readonly bangPhanLoaiTaiLieuRepository: Repository<BangPhanLoaiTaiLieu>,
  ) {}

  async getAllLoaiTaiLieu() {
    const listLoaiDotRaSoat = await this.bangPhanLoaiTaiLieuRepository.find();
    return listLoaiDotRaSoat;
  }
}
