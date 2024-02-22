import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BangThongTinChuHo, BangThongTinHo } from 'src/utils/typeorm';

@Injectable()
export class QlThongtinChuhoService {
  constructor(
    @InjectRepository(BangThongTinChuHo)
    private readonly chuHoRepository: Repository<BangThongTinChuHo>,
    @InjectRepository(BangThongTinHo)
    private readonly hoGiaDinhRepository: Repository<BangThongTinHo>,
  ) {}

  async getChuHoById(idHoGiaDinh: number) {
    const result = await this.chuHoRepository
      .createQueryBuilder('chuHo')
      .leftJoinAndSelect('chuHo.DanTocID', 'DanToc')
      .leftJoinAndSelect('chuHo.HoGiaDinhID', 'HoGiaDinh') // 'ho' là tên relation trong BangThongTinChuHo
      .where('chuHo.HoGiaDinhID = :idHoGiaDinh', { idHoGiaDinh })
      .andWhere('chuHo.IsRemoved = :isRemoved', { isRemoved: false })
      .getOne();

    return result;
  }

  async getOneChuHoByIDHoGiaDinh(
    idHoGiaDinh: number,
  ): Promise<BangThongTinChuHo> {
    const result = await this.chuHoRepository
      .createQueryBuilder('chuHo')
      .select(['chuHo.HoVaTenChuHo'])
      .where('chuHo.HoGiaDinhID = :idHoGiaDinh', { idHoGiaDinh })
      .andWhere('chuHo.IsRemoved = :isRemoved', { isRemoved: false })
      .getOne();

    return result;
  }
}
