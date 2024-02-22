import {
  Controller,
  Inject,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IPhanQuyen } from './phan-quyen';

@Controller(Routes.PHANQUYEN)
export class PhanQuyenController {
  constructor(
    @Inject(Services.PHANQUYEN) private readonly phanQuyenService: IPhanQuyen,
  ) {}

  @Get('')
  async getAll() {
    const result = await this.phanQuyenService.getAll();
    return result;
  }
}
