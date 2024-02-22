import { Controller, Get, Inject } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IQuanLyDanTocService } from './ql-dan-toc';
import { BangDanToc } from 'src/utils/typeorm';

@Controller(Routes.QUANLYDANTOC)
export class QlDanTocController {
  constructor(
    @Inject(Services.QUANLYDANTOC)
    private readonly quanlyDanToc: IQuanLyDanTocService,
  ) {}

  @Get('getAllDanToc')
  async getAllDanToc(): Promise<BangDanToc[]> {
    return this.quanlyDanToc.getAllDanToc();
  }
}
