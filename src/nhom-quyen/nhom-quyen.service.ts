import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { INhomQuyen } from './nhom-quyen';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangRoleGroup, BangRoleUser, BangUser } from 'src/utils/typeorm';

@Injectable()
export class NhomQuyenService implements INhomQuyen {
  constructor(
    @InjectRepository(BangRoleGroup)
    private readonly bangRoleGroupRepository: Repository<BangRoleGroup>,
    @InjectRepository(BangRoleUser)
    private readonly bangRoleUserRepository: Repository<BangRoleUser>,
    @InjectRepository(BangUser)
    private readonly bangUserRepository: Repository<BangUser>,
  ) {}

  async getAllNhomQuyen(search: string) {
    const query = this.bangRoleGroupRepository
      .createQueryBuilder('nhomQuyen')
      .where('nhomQuyen.IsRemoved = :isRemoved', { isRemoved: false });
    if (search) {
      query.andWhere('nhomQuyen.TenNhomQuyen LIKE :searchKey', {
        searchKey: `%${search.toLowerCase()}%`,
      });
    }
    const nhomQuyenList = await query.getMany();
    return nhomQuyenList;
  }

  async getDetailNhomQuyen(idNhomQuyen: number) {
    const checkExis = await this.bangRoleGroupRepository
      .createQueryBuilder('nhomQuyen')
      .where('nhomQuyen.RoleGroupID = :idNhomQuyen', {
        idNhomQuyen: idNhomQuyen,
      })
      .getOne();
    const quyenIDS = checkExis?.NhomQuyen || [];
    // console.log('quyenIDS: ', quyenIDS);
    const getDanhSachQuyenByNhomQuyenID = quyenIDS.length
      ? await this.bangRoleUserRepository
          .createQueryBuilder('phanQuyen')
          .where('phanQuyen.QuyenID IN (:...ids)', { ids: quyenIDS })
          .andWhere('phanQuyen.IsRemoved = :IsRemoved', { IsRemoved: false }) // Lọc hộ có IsRemoved là false

          .getMany()
      : [];

    // console.log('checkExis: ', checkExis);
    return checkExis;
  }

  async createNhomQuyen(dataNhomQuyen: any) {
    // const checkExis = await this.bangRoleGroupRepository
    //   .createQueryBuilder('nhomQuyen')
    //   .where('nhomQuyen.TenNhomQuyen = :tenNhomQuyen', {
    //     tenNhomQuyen: dataNhomQuyen.TenNhomQuyen,
    //   })
    //   .getOne();
    // if (checkExis) {
    //   throw new HttpException('Nhóm quyền đã tồn tại', HttpStatus.CONFLICT);
    // }
    const nhomQuyen = await this.bangRoleGroupRepository.create(dataNhomQuyen);
    const savedNhomQuyen = await this.bangRoleGroupRepository.save(nhomQuyen);
    return savedNhomQuyen;
  }

  async updateNhomQuyen(dataNhomQuyenEdit: any) {
    const getNhomQuyen = await this.bangRoleGroupRepository
      .createQueryBuilder('nhomQuyen')
      .where('nhomQuyen.RoleGroupID = :idNhomQuyen', {
        idNhomQuyen: dataNhomQuyenEdit.RoleGroupID,
      })
      .getOne();
    getNhomQuyen.TenNhomQuyen = dataNhomQuyenEdit.TenNhomQuyen;
    getNhomQuyen.NhomQuyen = dataNhomQuyenEdit.NhomQuyen;
    const updatedNhomQuyen = await this.bangRoleGroupRepository.save(
      getNhomQuyen,
    );
    return updatedNhomQuyen;
  }

  async deleteOneNhomQuyen(RoleGroupID) {
    // console.log('RoleGroupID: ', RoleGroupID);

    const getNhomQuyen = await this.bangRoleGroupRepository.findOne(
      RoleGroupID,
    );
    getNhomQuyen.IsRemoved = true;
    const saved = await this.bangRoleGroupRepository.save(getNhomQuyen);

    const usersWithRoleGroup = await this.bangUserRepository.find({
      where: {
        RoleGroupID: RoleGroupID,
      },
      select: ['UserID'],
    });
    const listIdUser = usersWithRoleGroup.map((item) => item.UserID);
    if (listIdUser.length) {
      await this.bangUserRepository
        .createQueryBuilder()
        .update(BangUser)
        .set({ RoleGroupID: null })
        .where('UserID IN (:...userIDs)', { userIDs: listIdUser })
        .execute();
    }
    return saved;
  }

  async deleteManyNhomQuyen(RoleGroupIDs) {
    const usersWithRoleGroups = await this.bangUserRepository
      .createQueryBuilder('user')
      .where('user.RoleGroupID IN (:...roleGroupIDs)', {
        roleGroupIDs: RoleGroupIDs,
      })
      .getMany();
    const listIdUser = usersWithRoleGroups.map((item) => item.UserID);
    if (listIdUser.length) {
      await this.bangUserRepository
        .createQueryBuilder()
        .update(BangUser)
        .set({ RoleGroupID: null })
        .where('UserID IN (:...userIDs)', { userIDs: listIdUser })
        .execute();
    }
    const updatedQuery = await this.bangRoleGroupRepository
      .createQueryBuilder()
      .update(BangRoleGroup);
    updatedQuery.set({ IsRemoved: true }).whereInIds(RoleGroupIDs).execute();
  }

  async copyNhomQuyen(RoleGroupIDs) {
    const roleGroups = await this.bangRoleGroupRepository
      .createQueryBuilder('roleGroup')
      .where('roleGroup.RoleGroupID IN (:...roleGroupIDs)', {
        roleGroupIDs: RoleGroupIDs,
      })
      .getMany();
    for (const item of roleGroups) {
      const createNhomQuyen = {
        TenNhomQuyen: item.TenNhomQuyen + '_Copy',
        NhomQuyen: item.NhomQuyen,
      };
      const nhomQuyen = await this.bangRoleGroupRepository.create(
        createNhomQuyen,
      );
      await this.bangRoleGroupRepository.save(nhomQuyen);
    }
  }
}
