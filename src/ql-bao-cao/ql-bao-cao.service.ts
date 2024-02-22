import { Injectable, NotFoundException } from '@nestjs/common';
import { IQuanLyBaoCao } from './ql-bao-cao';
import { InjectRepository } from '@nestjs/typeorm';
import { BangDanhSachBaoCao } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class QlBaoCaoService implements IQuanLyBaoCao {
  constructor(
    @InjectRepository(BangDanhSachBaoCao)
    private readonly bangDanhSachBaoCaoRepository: Repository<BangDanhSachBaoCao>,
  ) {}

  async createDanhSachBaoCao(danhSachBaoCaoDetail: any) {
    const newDanhSachTaiLieu = await this.bangDanhSachBaoCaoRepository.create(
      danhSachBaoCaoDetail,
    );
    const saved = await this.bangDanhSachBaoCaoRepository.save(
      newDanhSachTaiLieu,
    );
    return saved;
  }

  async getAllBaoCao(): Promise<BangDanhSachBaoCao[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase = await this.bangDanhSachBaoCaoRepository
      .createQueryBuilder('baoCao') // Sử dụng alias 'taiLieu' cho bảng BangDanhSachTaiLieu
      .leftJoinAndSelect('baoCao.NguoiTaoID', 'user') // Join với bảng User
      .leftJoinAndSelect('baoCao.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('baoCao.DonViID', 'donVi') // Join với bảng DonVi
      .where('baoCao.IsRemoved = :IsRemoved', { IsRemoved: false }) // Thêm điều kiện IsRemoved là null

      .getMany();

    return dataFromDatabase;
  }

  async getBaoCao(id: number): Promise<BangDanhSachBaoCao> {
    const baoCao = await this.bangDanhSachBaoCaoRepository
      .createQueryBuilder('baoCao') // Sử dụng alias 'taiLieu' cho bảng BangDanhSachTaiLieu
      .leftJoinAndSelect('baoCao.NguoiTaoID', 'user') // Join với bảng User
      .leftJoinAndSelect('baoCao.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('baoCao.DonViID', 'donVi') // Join với bảng DonVi
      .where('baoCao.BaoCaoID = :id', { id })
      .getOne();
    return baoCao;
  }

  async deleteBaoCaoID(baoCaoID: number): Promise<boolean> {
    // Tìm trường thông tin dựa trên ban
    const BaoCaoID = await this.bangDanhSachBaoCaoRepository.findOne(baoCaoID);

    if (!BaoCaoID) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${BaoCaoID}`,
      );
    }

    // Xóa trường thông tin
    BaoCaoID.IsRemoved = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await this.bangDanhSachBaoCaoRepository.save(BaoCaoID);

    return true; // Hoặc bạn có thể trả về thông tin khác để xác định rằng xóa thành công
  }
}
