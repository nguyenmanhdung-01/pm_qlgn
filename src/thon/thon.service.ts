import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangThon, BangXa } from '../utils/typeorm';
import { CreateThonDetails, editThon } from '../utils/types';
import { IThonService } from './thon';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class ThonService implements IThonService {
  constructor(
    @InjectRepository(BangThon)
    private readonly thonRepository: Repository<BangThon>,
    @InjectRepository(BangXa)
    private readonly xaRepository: Repository<BangXa>,
  ) {}

  async create(createDetails: CreateThonDetails) {
    const existing = await this.thonRepository.find({
      TenThon: createDetails.TenThon.trim(),
    });

    const existingXa = await this.xaRepository
      .createQueryBuilder('xa')
      .leftJoinAndSelect('xa.Thon', 'thon')
      .where('xa.XaID = :id', { id: createDetails.XaID })
      .getOne();
    console.log('existingXa', existingXa);
    const validate = existing.find((x) => x.IsRemoved === false);
    const existingThon = existingXa?.Thon?.find(
      (x) => x.TenThon === createDetails.TenThon.trim(),
    );
    if (validate && existingThon)
      throw new HttpException('Thôn đã tồn tại', HttpStatus.CONFLICT);

    const saved = await this.thonRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.thonRepository.findOne({
      where: { ThonID: id, IsRemoved: false },
      relations: ['DonVi'],
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Thôn with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async findChildrenByIdParent(id: number) {
    const result = await this.thonRepository.find({
      where: { XaID: id, IsRemoved: false },
      relations: ['DonVi'],
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Thôn with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async getAll(): Promise<BangThon[]> {
    const results = await this.thonRepository
      .createQueryBuilder('xa')
      .where('xa.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();

    return results;
  }

  async edit(id: number, editData: editThon): Promise<BangThon> {
    const existingXa = await this.xaRepository
      .createQueryBuilder('xa')
      .leftJoinAndSelect('xa.Thon', 'thon', 'thon.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .where('xa.XaID = :id', { id: editData.XaID })
      .getOne();

    const existingThon = existingXa?.Thon?.find(
      (x) => x.TenThon === editData.TenThon.trim(),
    );
    console.log('existingXa', existingXa);
    console.log('existingThon', existingThon);

    if (!existingThon) {
      console.log('zo');

      await this.thonRepository.update(id, editData);
      const result = await this.findById(id);
      // console.log('result',);

      return result;
    } else {
      console.log('out');

      throw new HttpException('Thôn đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async delete(idDelete: number[]): Promise<BangThon[]> {
    await this.thonRepository
      .createQueryBuilder()
      .update(BangThon)
      .set({ IsRemoved: true })
      .where('ThonID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.thonRepository.find();
    return dantoc;
  }
}
