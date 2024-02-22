import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/helpers';
import { BangUser } from '../utils/typeorm';
import { ChangPassWord, CreateUserDetails, editUser } from '../utils/types';
import { IUserService } from './users';
import { Services } from 'src/utils/constants';
import { compareHash } from 'src/utils/helpers';
import { AuthUser } from 'src/utils/decorators';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(BangUser)
    private readonly userRepository: Repository<BangUser>, // @Inject(Services.ROLE) private readonly roleService: IRoleService,
  ) {}

  async createUser(userDetails: CreateUserDetails) {
    const existing = await this.userRepository.find({
      TenDangNhap: userDetails.TenDangNhap,
    });

    const validate = existing.find((x) => x.IsRemoved === false);

    if (validate)
      throw new HttpException('Người dùng đã tồn tại', HttpStatus.CONFLICT);

    const password = await hashPassword(userDetails.MatKhau);
    const params = { ...userDetails, MatKhau: password };
    const savedUser = await this.userRepository.save(params);

    return savedUser;
  }

  async getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
    status: string,
  ): Promise<any> {
    const pageNumber = parseInt(offset);
    const pageSize = parseInt(limit);
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.RoleGroupID', 'rolegroup')
      .leftJoinAndSelect('user.CanBoID', 'canbo')
      .leftJoinAndSelect('user.DanTocID', 'dantoc')
      .where('user.IsRemoved = :isRemoved', { isRemoved: false });

    if (!isNaN(pageNumber) && !isNaN(pageSize)) {
      const offsetValue = (pageNumber - 1) * pageSize;
      queryBuilder.skip(offsetValue).take(pageSize);
    }

    if (
      search?.length !== 0 &&
      search !== undefined &&
      search !== 'undefined'
    ) {
      queryBuilder.andWhere('UPPER(user.HoVaTen) LIKE UPPER(:search)', {
        search: `%${search.toUpperCase()}%`,
      });
    }

    if (orderByParam === 'HoVaTen') {
      queryBuilder.orderBy('user.HoVaTen', desc === 'true' ? 'ASC' : 'DESC');
    } else if (orderByParam === 'UserID') {
      queryBuilder.orderBy('user.UserID', desc === 'true' ? 'ASC' : 'DESC');
    }

    if (status === 'blocked') {
      // console.log('status', status);
      queryBuilder.andWhere('user.Status = :Status', { Status: 'blocked' });
    } else if (status === 'active') {
      queryBuilder.andWhere('user.Status = :Status', { Status: 'active' });
    } else if (status === 'resgistered') {
      queryBuilder.andWhere('user.Status = :Status', { Status: 'resgistered' });
    } else {
      queryBuilder.andWhere('user.IsRemoved = :isRemoved', {
        isRemoved: false,
      });
    }

    const results = await queryBuilder.getMany();
    return results;
  }
  async findByUsername(TenDangNhap: string) {
    const user = await this.userRepository.findOne({
      where: { TenDangNhap },
      relations: ['CanBoID', 'DanTocID', 'RoleGroupID'],
    });

    if (!user) {
      throw new HttpException(
        'Tên đăng nhập không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findById(UserID: number) {
    const user = await this.userRepository.findOne({
      where: { UserID },
      relations: ['CanBoID', 'DanTocID', 'RoleGroupID'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async editUser(id: number, editUser: editUser): Promise<any> {
    // console.log('editUser', editUser);

    const user = await this.findById(id);
    if (user) {
      if (editUser?.RoleGroupID) {
        const newDataEdit = {
          ...editUser,
          Status: 'active',
        };
        await this.userRepository.update(id, newDataEdit);
      } else {
        await this.userRepository.update(id, editUser);
      }
    }
    return user;
  }

  async editPassword(user: BangUser, password: ChangPassWord): Promise<any> {
    const { passwordNew } = password;
    const passwordHash = await hashPassword(passwordNew);
    await this.userRepository.update(user.UserID, { MatKhau: passwordHash });
    return user;
  }

  async delete(idDelete: number[]): Promise<BangUser[]> {
    await this.userRepository
      .createQueryBuilder()
      .update(BangUser)
      .set({ IsRemoved: true })
      .where('UserID IN (:...ids)', { ids: idDelete })
      .execute();
    const result = await this.userRepository.find();
    return result;
  }
}
