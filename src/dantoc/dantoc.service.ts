import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangDanToc } from '../utils/typeorm';
import { CreateDanTocDetails, editDanToc } from '../utils/types';
import { IDanTocService } from './dantoc';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class DanTocService implements IDanTocService {
  constructor(
    @InjectRepository(BangDanToc)
    private readonly dantocRepository: Repository<BangDanToc>, // @Inject(Services.ROLE) private readonly roleService: IRoleService,
  ) {}

  async createDanToc(dantocDetails: CreateDanTocDetails) {
    const existing = await this.dantocRepository.find({
      TenDanToc: dantocDetails.TenDanToc,
    });
    const validate = existing.find((x) => x.IsRemoved === false);
    if (validate)
      throw new HttpException('Dân tộc đã tồn tại', HttpStatus.CONFLICT);

    const savedUser = await this.dantocRepository.save(dantocDetails);

    return savedUser;
  }

  async findById(UserID: number) {
    const user = await this.dantocRepository.findOne({
      where: { DanTocID: UserID, IsRemoved: false },
      // relations: ['CanBo'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAllDanToc(): Promise<BangDanToc[]> {
    const results = await this.dantocRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async editDanToc(
    idDanToc: number,
    editDanToc: editDanToc,
  ): Promise<BangDanToc> {
    const resultAll = await this.getAllDanToc();
    const result = await this.findById(idDanToc);
    const existingNN = resultAll?.find(
      (x) => x.TenDanToc === editDanToc.TenDanToc.trim(),
    );
    if (!existingNN) {
      await this.dantocRepository.update(idDanToc, editDanToc);
      return result;
    } else {
      throw new HttpException('Dân tộc đã tồn tại', HttpStatus.CONFLICT);
    }
  }

  async deleteDanToc(idDelete: number[]): Promise<BangDanToc[]> {
    await this.dantocRepository
      .createQueryBuilder()
      .update(BangDanToc)
      .set({ IsRemoved: true })
      .where('DanTocID IN (:...ids)', { ids: idDelete })
      .execute();
    const dantoc = await this.dantocRepository.find();
    return dantoc;
  }
}
