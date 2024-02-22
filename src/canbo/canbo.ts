import { BangCanBo } from '../utils/typeorm';
import { CreateCanboDetails, editCanBo, findByID } from '../utils/types';

export interface ICanBoService {
  create(createDetail: CreateCanboDetails): Promise<any>;
  findById(id: number): Promise<BangCanBo>;
  findByListID(id: findByID): Promise<BangCanBo[]>;
  edit(id: number, editParam: editCanBo): Promise<BangCanBo>;
  getAll(): Promise<BangCanBo[]>;
  delete(id: number[]): Promise<BangCanBo[]>;
}
