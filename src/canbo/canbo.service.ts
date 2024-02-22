import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangCanBo } from '../utils/typeorm';
import { CreateCanboDetails, editCanBo, findByID } from '../utils/types';
import { ICanBoService } from './canbo';

@Injectable()
export class CanBoService implements ICanBoService {
  constructor(
    @InjectRepository(BangCanBo)
    private readonly canboRepository: Repository<BangCanBo>,
  ) {}

  async create(createDetails: CreateCanboDetails) {
    const existingMaCB = await this.canboRepository.find({
      MaCanBo: createDetails.MaCanBo,
    });
    const validateMaCB = existingMaCB.find((x) => x.IsRemoved === false);
    const existingCCCD = await this.canboRepository.find({
      CmndCccd: createDetails.CmndCccd,
    });
    const validateCCCD = existingCCCD.find((x) => x.IsRemoved === false);

    if (validateMaCB) {
      throw new HttpException('Mã cán bộ đã tồn tại', HttpStatus.CONFLICT);
    }
    if (validateCCCD) {
      throw new HttpException('CCCD đã tồn tại', HttpStatus.CONFLICT);
    }

    const saved = await this.canboRepository.save(createDetails);

    return saved;
  }

  async findById(id: number) {
    const result = await this.canboRepository.findOne({
      where: { CanBoID: id, IsRemoved: false },
      relations: ['Tinh', 'Huyen', 'Xa', 'DanToc', 'Thon', 'DonVi'],
    });
    if (result) {
      return result;
    }
    throw new HttpException(
      'Đơn vị with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findByListID(id: findByID) {
    console.log('id', id);

    const result = await this.canboRepository
      .createQueryBuilder('donvi')
      .where('donvi.VungID = :value1', { value1: id.VungID })
      .andWhere('donvi.TinhID = :value2', { value2: id.TinhID })
      .andWhere('donvi.HuyenID = :value3', { value3: id.HuyenID })
      .andWhere('donvi.XaID = :value4', { value4: id.XaID })
      .getMany(); // Lấy tất cả các kết quả thỏa mãn điều kiện
    if (result) {
      return result;
    }
    throw new HttpException(
      'Đơn vị with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAll(): Promise<BangCanBo[]> {
    const results = await this.canboRepository.find({
      relations: ['Tinh', 'Huyen', 'Xa', 'DanToc', 'Thon', 'DonVi'],
    });
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async edit(id: number, editData: editCanBo): Promise<BangCanBo> {
    await this.canboRepository.update(id, editData);
    const result = await this.findById(id);
    return result;
  }

  async delete(idDelete: number[]): Promise<BangCanBo[]> {
    await this.canboRepository
      .createQueryBuilder()
      .update(BangCanBo)
      .set({ IsRemoved: true })
      .where('CanBoID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.canboRepository.find();
    return dantoc;
  }
}
