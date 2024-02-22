import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BangDanToc } from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QlDanTocService {
  constructor(
    @InjectRepository(BangDanToc)
    private readonly danTocRepository: Repository<BangDanToc>,
  ) {}

  async getAllDanToc(): Promise<BangDanToc[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase = await this.danTocRepository
      .createQueryBuilder('danToc') // Sử dụng alias 'taiLieu' cho bảng BangDanhSachTaiLieu // Thêm điều kiện IsRemoved là null
      .getMany();

    return dataFromDatabase;
  }
}
