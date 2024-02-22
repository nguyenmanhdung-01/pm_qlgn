import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangDonVi, BangVung } from '../utils/typeorm';
import { CreateVungDetails, editDanToc, editVung } from '../utils/types';
import { IVungService } from './vung';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class VungService implements IVungService {
  constructor(
    @InjectRepository(BangVung)
    private readonly vungRepository: Repository<BangVung>, // @Inject(Services.ROLE) private readonly roleService: IRoleService,
  ) {}

  async createVung(vungDetails: CreateVungDetails) {
    const existing = await this.vungRepository.find({
      TenVung: vungDetails.TenVung.trim(),
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Vùng đã tồn tại', HttpStatus.CONFLICT);

    const savedVung = await this.vungRepository.save(vungDetails);

    return savedVung;
  }

  async findById(id: number) {
    const result = await this.vungRepository.findOne({
      where: { VungID: id, IsRemoved: false },
      relations: ['DonVi', 'Tinh'],
    });
    if (result) {
      // Lọc danh sách huyện theo điều kiện IsRemoved === false
      result.Tinh = result.Tinh.filter((x) => !x.IsRemoved);
      return result;
    }

    throw new HttpException(
      'Tinh with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findDonViById(
    id: number,
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
  ): Promise<{ data: BangDonVi[]; toltal: number }> {
    const pageNumber = parseInt(offset);
    const pageSize = parseInt(limit);
    const queryBuilder = await this.vungRepository
      .createQueryBuilder('vung')
      .leftJoinAndSelect('vung.DonVi', 'donvi')
      .where('vung.IsRemoved = :isRemoved', { isRemoved: false })
      .andWhere('vung.VungID = :id', { id });

    if (!isNaN(pageNumber) && !isNaN(pageSize)) {
      const offsetValue = (pageNumber - 1) * pageSize;
      queryBuilder.skip(offsetValue).take(pageSize);
    }

    if (
      search?.length !== 0 &&
      search?.length !== undefined &&
      search !== 'undefined'
    ) {
      queryBuilder.andWhere('donvi.TenDonVi LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (orderByParam === 'DonViID') {
      queryBuilder.orderBy('donvi.DonViID', desc === 'true' ? 'ASC' : 'DESC');
    } else if (orderByParam === 'TenDonVi') {
      queryBuilder.orderBy('donvi.TenDonVi', desc === 'true' ? 'ASC' : 'DESC');
    }

    const results = await queryBuilder.getOne();
    return { data: results?.DonVi, toltal: results?.DonVi?.length };
  }

  async getAllVung(): Promise<BangVung[]> {
    //
    const results = await this.vungRepository
      .createQueryBuilder('vung')
      .leftJoinAndSelect('vung.Tinh', 'tinh', 'tinh.IsRemoved = :IsRemoved', {
        IsRemoved: false,
      })
      .where('vung.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();

    return results;
  }

  async editVung(idVung: number, editVung: editVung): Promise<BangVung> {
    const existing = await this.vungRepository.findOne({
      TenVung: editVung.TenVung,
    });
    if (existing) {
      throw new HttpException(
        'Khu vực rà soát đã tồn tại',
        HttpStatus.CONFLICT,
      );
    } else {
      const result = await this.findById(idVung);
      await this.vungRepository.update(idVung, editVung);
      return result;
    }
  }

  async deleteVung(idDelete: number[]): Promise<BangVung[]> {
    await this.vungRepository
      .createQueryBuilder()
      .update(BangVung)
      .set({ IsRemoved: true })
      .where('VungID IN (:...ids)', { ids: idDelete })
      .execute();
    const vung = await this.vungRepository.find();
    return vung;
  }
}
