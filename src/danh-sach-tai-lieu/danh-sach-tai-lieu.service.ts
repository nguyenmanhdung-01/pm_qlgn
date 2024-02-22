import { Injectable } from '@nestjs/common';
import { IDanhSachTaiLieu } from './danh-sach-tai-lieu';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BangDanhSachTaiLieu,
  MappingDotRaSoatVaTaiLieuLienQuan,
} from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DanhSachTaiLieuService implements IDanhSachTaiLieu {
  constructor(
    @InjectRepository(BangDanhSachTaiLieu)
    private readonly bangDanhSachTaiLieuRepository: Repository<BangDanhSachTaiLieu>,
    @InjectRepository(MappingDotRaSoatVaTaiLieuLienQuan)
    private readonly bangMappingDotRaSoatVaTaiLieuLienQuanRepository: Repository<MappingDotRaSoatVaTaiLieuLienQuan>,
  ) {}

  async getTaiLieuTheoDotRaSoat(DotRaSoatID) {
    const danhSachTaiLieu =
      await this.bangMappingDotRaSoatVaTaiLieuLienQuanRepository
        .createQueryBuilder('mapping')
        .leftJoinAndSelect('mapping.TaiLieuID', 'taiLieu')
        .where('mapping.DotRaSoatID = :DotRaSoatID', { DotRaSoatID })
        .andWhere('taiLieu.IsRemoved = :IsRemoved', { IsRemoved: false })
        .leftJoinAndSelect('taiLieu.NguoiTaoID', 'nguoiTao')
        .leftJoinAndSelect('taiLieu.NguoiChinhSuaID', 'nguoiChinhSuaID')
        .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu')
        .getMany();
    return danhSachTaiLieu;
  }

  async createDanhSachTaiLieu(danhSachTaiLieuDetail) {
    const newDanhSachTaiLieu = await this.bangDanhSachTaiLieuRepository.create(
      danhSachTaiLieuDetail,
    );
    const saved = await this.bangDanhSachTaiLieuRepository.save(
      newDanhSachTaiLieu,
    );
    return saved;
  }

  async editDanhSachTaiLieu(danhSachTaiLieuEdit: any) {
    console.log('danhSachTaiLieuEdit: ', danhSachTaiLieuEdit);

    const getTaiLieu = await this.bangDanhSachTaiLieuRepository.findOne(
      danhSachTaiLieuEdit.TaiLieuID,
    );
    getTaiLieu.TenTaiLieu = danhSachTaiLieuEdit.TenTaiLieu;
    getTaiLieu.Url = danhSachTaiLieuEdit.Url;
    getTaiLieu.LoaiTaiLieu = danhSachTaiLieuEdit.LoaiTaiLieu;
    getTaiLieu.NguoiChinhSuaID = danhSachTaiLieuEdit.NguoiChinhSuaID;
    getTaiLieu.ThoiGianCapNhat = new Date();

    const saved = await this.bangDanhSachTaiLieuRepository.save(getTaiLieu);
    return saved;
  }

  async deleteOneDanhSachTaiLieu(TaiLieuID) {
    const getTaiLieu = await this.bangDanhSachTaiLieuRepository.findOne(
      TaiLieuID,
    );
    if (getTaiLieu) {
      getTaiLieu.IsRemoved = true;
      const saved = await this.bangDanhSachTaiLieuRepository.save(getTaiLieu);
      return saved;
    }
  }

  async deleteManyDanhSachTaiLieu(TaiLieuIDs) {
    const updatedQuery = await this.bangDanhSachTaiLieuRepository
      .createQueryBuilder()
      .update(BangDanhSachTaiLieu);
    updatedQuery.set({ IsRemoved: true }).whereInIds(TaiLieuIDs).execute();
  }
}
