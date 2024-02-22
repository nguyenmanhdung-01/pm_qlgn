import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangRoleUser } from 'src/utils/typeorm';
import { IPhanQuyen } from './phan-quyen';

@Injectable()
export class PhanQuyenService implements IPhanQuyen {
  constructor(
    @InjectRepository(BangRoleUser)
    private readonly bangRoleUserRepository: Repository<BangRoleUser>,
  ) {}

  async getAll() {
    const result = await this.bangRoleUserRepository
      .createQueryBuilder('phanQuyen')
      .getMany();
    return result;
  }
}
