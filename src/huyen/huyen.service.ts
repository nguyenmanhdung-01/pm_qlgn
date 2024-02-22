import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangHuyen, BangTinh } from '../utils/typeorm';
import { CreateHuyenDetails, editHuyen } from '../utils/types';
import { IHuyenService } from './huyen';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class HuyenService implements IHuyenService {
  constructor(
    @InjectRepository(BangHuyen)
    private readonly huyenRepository: Repository<BangHuyen>,
    @InjectRepository(BangTinh)
    private readonly tinhRepository: Repository<BangTinh>,
  ) {}

  async create(createDetails: CreateHuyenDetails) {
    const existing = await this.huyenRepository.find({
      TenHuyen: createDetails.TenHuyen.trim(),
    });
    console.log('createDetails', createDetails);

    const existingTinh = await this.tinhRepository
      .createQueryBuilder('tinh')
      .leftJoinAndSelect('tinh.Huyen', 'huyen')
      .where('tinh.TinhID = :id', { id: createDetails.TinhID })
      .getOne();
    console.log('existingTinh', existingTinh);

    const existingHuyen = existingTinh?.Huyen?.find(
      (x) => x.TenHuyen === createDetails.TenHuyen.trim(),
    );
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate && existingHuyen)
      throw new HttpException('Huyện đã tồn tại', HttpStatus.CONFLICT);
    const saved = await this.huyenRepository.save(createDetails);
    return saved;
  }

  async findById(id: number) {
    const result = await this.huyenRepository.findOne({
      where: { HuyenID: id, IsRemoved: false },
      relations: ['DonVi', 'Xa', 'CanBo'],
    });
    if (result) {
      // Lọc danh sách huyện theo điều kiện IsRemoved === false
      result.Xa = result.Xa.filter((x) => !x.IsRemoved);
      return result;
    }

    throw new HttpException(
      'Tinh with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findChildrenByIdParent(id: number) {
    const result = await this.huyenRepository.find({
      where: { TinhID: id, IsRemoved: false },
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Huyen with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangHuyen[]> {
    const results = await this.huyenRepository
      .createQueryBuilder('huyen')
      .leftJoinAndSelect('huyen.Xa', 'xa', 'xa.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .leftJoinAndSelect('huyen.Tinh', 'tinh', 'tinh.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .where('huyen.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();

    return results;
  }

  async edit(id: number, editData: editHuyen): Promise<BangHuyen> {
    const existingTinh = await this.tinhRepository
      .createQueryBuilder('tinh')
      .leftJoinAndSelect(
        'tinh.Huyen',
        'huyen',
        'huyen.IsRemoved = :IsRemoved',
        {
          IsRemoved: false,
        },
      )
      .where('tinh.TinhID = :id', { id: editData.TinhID })
      .getOne();

    const existingHuyen = existingTinh?.Huyen?.find(
      (x) => x.TenHuyen === editData.TenHuyen.trim(),
    );
    if (!existingHuyen) {
      await this.huyenRepository.update(id, editData);
      const result = await this.findById(id);
      return result;
    } else {
      throw new HttpException('Huyện đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangHuyen[]> {
    await this.huyenRepository
      .createQueryBuilder()
      .update(BangHuyen)
      .set({ IsRemoved: true })
      .where('HuyenID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.huyenRepository.find();
    return dantoc;
  }
}
