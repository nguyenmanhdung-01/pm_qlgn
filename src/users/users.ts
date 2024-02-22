import { BangUser } from '../utils/typeorm';
import { ChangPassWord, CreateUserDetails, editUser } from '../utils/types';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<BangUser>;
  findByUsername(userName: string): Promise<BangUser>;
  findById(id: number): Promise<BangUser>;
  editUser(id: number, editUser: editUser): Promise<BangUser>;
  editPassword(
    user: BangUser,
    changePassword: ChangPassWord,
  ): Promise<BangUser>;
  getAll(
    search: string,
    offset: string,
    limit: string,
    orderByParam: string,
    desc: string,
    status: string,
  ): Promise<any>;
  delete(id: number[]): Promise<BangUser[]>;
}
