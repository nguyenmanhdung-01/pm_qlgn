import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangHuyen, BangXa } from '../utils/typeorm';
import { CreateXaDetails, editXa } from '../utils/types';
import { IXaService } from './xa';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class XaService implements IXaService {
  constructor(
    @InjectRepository(BangXa)
    private readonly xaRepository: Repository<BangXa>,
    @InjectRepository(BangHuyen)
    private readonly huyenRepository: Repository<BangHuyen>,
  ) {}

  async create(createDetails: CreateXaDetails) {
    const existing = await this.xaRepository.find({
      TenXa: createDetails.TenXa.trim(),
    });

    const existingHuyen = await this.huyenRepository
      .createQueryBuilder('huyen')
      .leftJoinAndSelect('huyen.Xa', 'xa')
      .where('huyen.HuyenID = :id', { id: createDetails.HuyenID })
      .getOne();
    console.log('existingHuyen', existingHuyen);
    const existingXa = existingHuyen?.Xa?.find(
      (x) => x.TenXa === createDetails.TenXa.trim(),
    );
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate && existingXa)
      throw new HttpException('Xã đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.xaRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.xaRepository.findOne({
      where: { XaID: id, IsRemoved: false },
      relations: ['DonVi', 'Thon', 'CanBo'],
    });
    if (result) {
      // Lọc danh sách huyện theo điều kiện IsRemoved === false
      result.Thon = result.Thon.filter((x) => !x.IsRemoved);
      return result;
    }
    throw new HttpException(
      'Xa with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findChildrenByIdParent(id: number) {
    const queryBuilder = this.xaRepository
      .createQueryBuilder('xa')
      .where({ HuyenID: id, IsRemoved: false })
      .orderBy('xa.XaID', 'ASC');

    const result = await queryBuilder.getMany();

    if (result) {
      return result;
    }

    throw new HttpException(
      'Xa with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangXa[]> {
    const results = await this.xaRepository
      .createQueryBuilder('xa')
      .leftJoinAndSelect('xa.Thon', 'thon', 'thon.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .leftJoinAndSelect('xa.Huyen', 'huyen', 'huyen.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .where('xa.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();

    return results;
  }

  async edit(id: number, editData: editXa): Promise<BangXa> {
    const existingHuyen = await this.huyenRepository
      .createQueryBuilder('huyen')
      .leftJoinAndSelect('huyen.Xa', 'xa', 'xa.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .where('huyen.HuyenID = :id', { id: editData.HuyenID })
      .getOne();

    const existingXa = existingHuyen?.Xa?.find(
      (x) => x.TenXa === editData.TenXa.trim(),
    );
    if (!existingXa) {
      await this.xaRepository.update(id, editData);
      const result = await this.findById(id);
      return result;
    } else {
      throw new HttpException('Xã đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangXa[]> {
    await this.xaRepository
      .createQueryBuilder()
      .update(BangXa)
      .set({ IsRemoved: true })
      .where('XaID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.xaRepository.find();
    return dantoc;
  }
}
