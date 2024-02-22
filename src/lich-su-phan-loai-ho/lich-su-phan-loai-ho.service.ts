import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BangLichSuPhanLoaiHo } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { createHistoryHo } from './dtos/createHistoryHo.dto';
@Injectable()
export class LichSuPhanLoaiHoService {
  constructor(
    @InjectRepository(BangLichSuPhanLoaiHo)
    private readonly lichSuRepository: Repository<BangLichSuPhanLoaiHo>,
  ) {}

  async createHistory(
    createHistoryDto: createHistoryHo,
  ): Promise<BangLichSuPhanLoaiHo> {
    const historyHo = this.lichSuRepository.create(createHistoryDto);
    return await this.lichSuRepository.save(historyHo);
  }

  async getPhanLoaiDS(DanhSachID) {
    const historyHo = await this.lichSuRepository
      .createQueryBuilder('history')
      .where('history.DanhSachDieuTraID = :DanhSachID', {
        DanhSachID: DanhSachID,
      })
      .andWhere('history.IsRemoved = :IsRemoved', { IsRemoved: false })
      .leftJoinAndSelect('history.PhanLoaiHoTruocKhiRaSoatID', 'phanLoaiHo')
      .leftJoinAndSelect('history.HoGiaDinhID', 'hoGiaDinh')
      .getMany();

    return historyHo;
  }

  async updateAfterPlHo(afterPlh: any[]) {
    for (const item of afterPlh) {
      // Tìm đối tượng BangLichSuPhanLoaiHo dựa trên LichSuID
      const lichSuEntity = await this.lichSuRepository.findOne(item.LichSuID);

      if (!lichSuEntity) {
        throw new NotFoundException(
          `Entity with LichSuID ${item.LichSuID} not found`,
        );
      }

      // Tìm đối tượng BangPhanLoaiHo tương ứng từ bangPhanLoaiHoEntities
      // const phanLoaiHo = await this.phanLoaiHoRepository.findOne(item.PhanLoaiHoSauKhiRaSoatID);
      // if (!phanLoaiHo) {
      //   throw new NotFoundException(`Entity with PhanLoaiHoID ${item.PhanLoaiHoSauKhiRaSoatID} not found`);
      // }

      // Cập nhật trường PhanLoaiHoSauKhiRaSoatID
      lichSuEntity.PhanLoaiHoSauKhiRaSoatID = item.PhanLoaiHoSauKhiRaSoatID;

      // Lưu vào cơ sở dữ liệu
      await this.lichSuRepository.save(lichSuEntity);
    }
  }
}
