import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BangDanhSachTaiLieu,
  BangDonVi,
  BangPhanLoaiTaiLieu,
  BangThongTinHo,
  BangUser,
} from 'src/utils/typeorm';
import { CreateTaiLieuDto } from './dtos/CreateDocument.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTaiLieuDto } from './dtos/UpdateDocument.dto';
@Injectable()
export class QlTaiLieuService {
  constructor(
    @InjectRepository(BangDanhSachTaiLieu)
    private readonly taiLieuRepository: Repository<BangDanhSachTaiLieu>,
    @InjectRepository(BangUser)
    private readonly bangUserRepository: Repository<BangUser>,
    @InjectRepository(BangPhanLoaiTaiLieu)
    private readonly bangPhanLoaiTaiLieuRepository: Repository<BangPhanLoaiTaiLieu>,
    @InjectRepository(BangDonVi)
    private readonly bangDonViReponsitory: Repository<BangDonVi>,
    @InjectRepository(BangThongTinHo)
    private readonly bangTTHoReponsitory: Repository<BangThongTinHo>,
  ) {}

  async createTaiLieu(
    userId: number,
    LoaiTaiLieuID: number,
    DonViID: number,
    taiLieuDto: CreateTaiLieuDto,
    HoGiaDinhID: number,
  ): Promise<BangDanhSachTaiLieu> {
    console.log('HoGiaDinhID', HoGiaDinhID);

    const user = await this.bangUserRepository.findOne(userId, {
      relations: ['RoleGroupID', 'CanBoID', 'DanTocID'],
    });

    if (!user) {
      throw new HttpException(
        'Không có dữ liệu người dùng',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!LoaiTaiLieuID) {
      throw new HttpException(
        'LoaiTaiLieuID không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const donvi = await this.bangDonViReponsitory.findOneOrFail(DonViID);

    const loaiTaiLieu = await this.bangPhanLoaiTaiLieuRepository.findOneOrFail(
      LoaiTaiLieuID,
    );

    const HoGiaDinh = await this.bangTTHoReponsitory.findOne(HoGiaDinhID);

    //console.log('LoaiTaiLieuID: ' + loaiTaiLieu);
    // if (!HoGiaDinh) {
    //   throw new HttpException('Không có dữ liệu hộ', HttpStatus.BAD_REQUEST);
    // }

    const taiLieu = new BangDanhSachTaiLieu();
    taiLieu.TenTaiLieu = taiLieuDto.TenTaiLieu;
    taiLieu.Url = taiLieuDto.Url;
    taiLieu.BackupUrl = taiLieuDto.BackupUrl;
    taiLieu.ChartUrl = taiLieuDto.ChartUrl;
    taiLieu.LoaiTaiLieu = loaiTaiLieu;
    // taiLieu.LoaiTaiLieu.LoaiTaiLieuID = taiLieuDto.LoaiTaiLieuID;
    taiLieu.DonViID = donvi.DonViID;
    taiLieu.NguoiTaoID = user.UserID;
    taiLieu.KetXuatBC = taiLieuDto.KetXuatBC;

    if (HoGiaDinhID) {
      // console.log('đúng');

      taiLieu.HoGiaDinhID = HoGiaDinh;
    }

    // Xử lý lưu file vào thư mục hoặc lưu URL file vào trường tương ứng (tùy vào cách bạn thiết kế)

    // Lưu vào cơ sở dữ liệu
    return await this.taiLieuRepository.save(taiLieu);
  }

  async deleteMultiple(ids: number[]) {
    await this.taiLieuRepository
      .createQueryBuilder()
      .update(BangDanhSachTaiLieu) // Thay thế `BangTruongThongTinHoEntity` bằng tên thực thể thực sự của bạn
      .set({ IsRemoved: true }) // Cập nhật trường IsRemoved thành true
      .whereInIds(ids) // Lọc theo danh sách ids
      .execute();
  }

  async deleteTruongThongTinHo(taiLieuID: number): Promise<boolean> {
    // Tìm trường thông tin dựa trên ban
    const TaiLieuID = await this.taiLieuRepository.findOne(taiLieuID);

    if (!TaiLieuID) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${TaiLieuID}`,
      );
    }

    // Xóa trường thông tin
    TaiLieuID.IsRemoved = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await this.taiLieuRepository.save(TaiLieuID);

    return true; // Hoặc bạn có thể trả về thông tin khác để xác định rằng xóa thành công
  }

  async getAllTaiLieuHoGD(idHoGiaDinh: 1): Promise<BangDanhSachTaiLieu[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase = await this.taiLieuRepository
      .createQueryBuilder('taiLieu') // Sử dụng alias 'taiLieu' cho bảng BangDanhSachTaiLieu
      .leftJoinAndSelect('taiLieu.NguoiTaoID', 'user') // Join với bảng User
      .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('taiLieu.DonViID', 'donVi') // Join với bảng DonVi
      .where('taiLieu.HoGiaDinhID = :idHoGiaDinh', { idHoGiaDinh })
      .andWhere('taiLieu.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();

    return dataFromDatabase;
  }

  async getAllTaiLieu(): Promise<BangDanhSachTaiLieu[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase = await this.taiLieuRepository
      .createQueryBuilder('taiLieu') // Sử dụng alias 'taiLieu' cho bảng BangDanhSachTaiLieu
      .leftJoinAndSelect('taiLieu.NguoiTaoID', 'user') // Join với bảng User
      .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('taiLieu.DonViID', 'donVi') // Join với bảng DonVi
      .where('taiLieu.IsRemoved = :IsRemoved', { IsRemoved: false }) // Thêm điều kiện IsRemoved là null
      .andWhere('taiLieu.HoGiaDinhID IS NULL')
      .getMany();

    return dataFromDatabase;
  }

  async updateTaiLieu(
    id: number,
    nguoiChinhSua: number,
    taiLieuDto: UpdateTaiLieuDto,
  ) {
    const taiLieu = await this.taiLieuRepository.findOne(id);
    if (!taiLieu) {
      throw new HttpException('Không có dữ liệu', HttpStatus.NOT_FOUND);
    }

    const user = await this.bangUserRepository.findOne(nguoiChinhSua, {
      relations: ['RoleGroupID', 'CanBoID', 'DanTocID'],
    });

    // console.log('user', user);

    if (!user) {
      throw new HttpException(
        'Không có dữ liệu người dùng',
        HttpStatus.NOT_FOUND,
      );
    }

    const donvi = await this.bangDonViReponsitory.findOneOrFail(
      taiLieuDto.DonViID,
    );

    const loaiTaiLieu = await this.bangPhanLoaiTaiLieuRepository.findOneOrFail(
      taiLieuDto.LoaiTaiLieuID,
    );

    if (taiLieuDto.TenTaiLieu) {
      taiLieu.TenTaiLieu = taiLieuDto.TenTaiLieu;
    }
    if (taiLieuDto.Url) {
      taiLieu.Url = taiLieuDto.Url;
    }
    if (taiLieuDto.BackupUrl) {
      taiLieu.BackupUrl = taiLieuDto.BackupUrl;
    }
    if (taiLieuDto.ChartUrl) {
      taiLieu.ChartUrl = taiLieuDto.ChartUrl;
    }
    if (taiLieuDto.DonViID) {
      taiLieu.DonViID = donvi.DonViID;
    }
    if (taiLieuDto.LoaiTaiLieuID) {
      taiLieu.LoaiTaiLieu = loaiTaiLieu;
    }

    taiLieu.NguoiChinhSuaID = user.UserID;

    const updatedTaiLieu = await this.taiLieuRepository.save(taiLieu);

    return updatedTaiLieu;
  }

  async getTaiLieu(id: number): Promise<BangDanhSachTaiLieu> {
    const taiLieu = await this.taiLieuRepository
      .createQueryBuilder('taiLieu') // Sử dụng alias 'taiLieu' cho bảng BangDanhSachTaiLieu
      .leftJoinAndSelect('taiLieu.NguoiChinhSuaID', 'user') // Join với bảng User
      .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('taiLieu.DonViID', 'donVi') // Join với bảng DonVi
      .where('taiLieu.TaiLieuID = :id', { id })
      .getOne();
    return taiLieu;
  }

  async getAllDocument(queryParams: any) {
    console.log('query', queryParams);

    const searchKey = queryParams.searchKey;
    const typeSort = queryParams.typeSort;
    const fieldSort = queryParams.fieldSort;
    const startDate = queryParams.startDate;
    const endDate = queryParams.endDate;
    const timeStartUpdate = queryParams.timeStartUpdate;
    const timeEndUpdate = queryParams.timeEndUpdate;
    const page = queryParams.page;
    const pageSize = 5;
    const donViID = queryParams.donViID;
    const query = this.taiLieuRepository
      .createQueryBuilder('taiLieu')
      .where('taiLieu.IsRemoved=:IsRemoved', { IsRemoved: false })
      .andWhere('taiLieu.HoGiaDinhID IS NULL')
      .andWhere(
        '(taiLieu.TenTaiLieu LIKE :searchKey OR taiLieu.TaiLieuID LIKE :searchKey)',
        {
          searchKey: `%${searchKey}%`,
        },
      )
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .leftJoinAndSelect('taiLieu.NguoiTaoID', 'user') // Join với bảng User
      .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('taiLieu.DonViID', 'donVi');

    if (startDate && endDate) {
      query.andWhere('taiLieu.ThoiGianTao BETWEEN :startDate AND :endDate', {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      });
    }

    if (timeStartUpdate && timeEndUpdate) {
      query.andWhere(
        'taiLieu.ThoiGianCapNhat BETWEEN :timeStartUpdate AND :timeEndUpdate',
        {
          timeStartUpdate: queryParams.timeStartUpdate,
          timeEndUpdate: queryParams.timeEndUpdate,
        },
      );
    }

    if (typeSort && (typeSort === 'ASC' || typeSort === 'DESC')) {
      query.orderBy(`taiLieu.${fieldSort}`, typeSort as 'ASC' | 'DESC');
    }

    console.log('query', query);

    const queryCount = this.taiLieuRepository
      .createQueryBuilder('taiLieu')
      .where('taiLieu.IsRemoved=:IsRemoved', { IsRemoved: false })
      .andWhere('taiLieu.HoGiaDinhID IS NULL');
    if (queryCount) {
      queryCount.andWhere('taiLieu.TenTaiLieu LIKE :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    }

    if (donViID) {
      query.andWhere('taiLieu.DonViID.DonViID = :donViID', {
        donViID: queryParams.donViID,
      });
      queryCount.andWhere('taiLieu.DonViID.DonViID = :donViID', {
        donViID: queryParams.donViID,
      });
    }

    // const queryAll = this.taiLieuRepository
    //   .createQueryBuilder('taiLieu')
    //   .where('taiLieu.IsRemoved IS NULL') // Thêm điều kiện IsRemoved là null
    //   .andWhere('taiLieu.HoGiaDinhID IS NULL')
    //   .skip((page - 1) * pageSize)
    //   .take(pageSize)
    //   .leftJoinAndSelect('taiLieu.NguoiTaoID', 'user') // Join với bảng User
    //   .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
    //   .leftJoinAndSelect('taiLieu.DonViID', 'donVi')
    //   // .leftJoinAndSelect('taiLieu.NguoiChinhSuaID', 'user')
    //   .getMany();

    const taiLieuList = await query.getMany();
    // console.log('taiLieuList', taiLieuList);

    const taiLieuCount = await queryCount.getCount();

    return { taiLieuList, taiLieuCount };
  }

  async getAllDocumentKetXuat(queryParams: any) {
    // console.log('query', queryParams);

    const searchKey = queryParams.searchKey;
    const typeSort = queryParams.typeSort;
    const fieldSort = queryParams.fieldSort;
    const startDate = queryParams.startDate;
    const endDate = queryParams.endDate;
    const timeStartUpdate = queryParams.timeStartUpdate;
    const timeEndUpdate = queryParams.timeEndUpdate;
    const page = queryParams.page;
    const pageSize = 5;
    const donViID = queryParams.donViID;
    const query = this.taiLieuRepository
      .createQueryBuilder('taiLieu')
      .where('taiLieu.IsRemoved=:IsRemoved', { IsRemoved: false })
      .andWhere('taiLieu.KetXuatBC=:KetXuatBC', { KetXuatBC: true })
      .andWhere('taiLieu.HoGiaDinhID IS NULL')
      .andWhere(
        '(taiLieu.TenTaiLieu LIKE :searchKey OR taiLieu.TaiLieuID LIKE :searchKey)',
        {
          searchKey: `%${searchKey}%`,
        },
      )
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .leftJoinAndSelect('taiLieu.NguoiTaoID', 'user') // Join với bảng User
      .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
      .leftJoinAndSelect('taiLieu.DonViID', 'donVi');
    // .leftJoinAndSelect('taiLieu.NguoiChinhSuaID', 'user'); // Join với bảng DonVi
    // if (searchKey) {
    //   query
    //     .andWhere('taiLieu.HoGiaDinhID IS NULL')
    //     .andWhere('taiLieu.TenTaiLieu LIKE :searchKey', {
    //       searchKey: `%${searchKey}%`,
    //     })
    //     .orWhere('taiLieu.TaiLieuID LIKE :searchKey', {
    //       searchKey: `%${searchKey}%`,
    //     });
    //   // .orWhere('taiLieu.loaiTaiLieu.TenLoaiTaiLieu LIKE :searchKey', {
    //   //   searchKey: `%${searchKey}%`,
    //   // });
    // }

    if (startDate && endDate) {
      query.andWhere('taiLieu.ThoiGianTao BETWEEN :startDate AND :endDate', {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      });
    }

    if (timeStartUpdate && timeEndUpdate) {
      query.andWhere(
        'taiLieu.ThoiGianCapNhat BETWEEN :timeStartUpdate AND :timeEndUpdate',
        {
          timeStartUpdate: queryParams.timeStartUpdate,
          timeEndUpdate: queryParams.timeEndUpdate,
        },
      );
    }

    if (typeSort && (typeSort === 'ASC' || typeSort === 'DESC')) {
      query.orderBy(`taiLieu.${fieldSort}`, typeSort as 'ASC' | 'DESC');
    }

    // console.log('query', query);

    const queryCount = this.taiLieuRepository
      .createQueryBuilder('taiLieu')
      .where('taiLieu.IsRemoved=:IsRemoved', { IsRemoved: false })
      .andWhere('taiLieu.KetXuatBC=:KetXuatBC', { KetXuatBC: true })
      .andWhere('taiLieu.HoGiaDinhID IS NULL');
    if (queryCount) {
      queryCount.andWhere('taiLieu.TenTaiLieu LIKE :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    }

    if (donViID) {
      query.andWhere('taiLieu.DonViID.DonViID = :donViID', {
        donViID: queryParams.donViID,
      });
      queryCount.andWhere('taiLieu.DonViID.DonViID = :donViID', {
        donViID: queryParams.donViID,
      });
    }

    // const queryAll = this.taiLieuRepository
    //   .createQueryBuilder('taiLieu')
    //   .where('taiLieu.IsRemoved IS NULL') // Thêm điều kiện IsRemoved là null
    //   .andWhere('taiLieu.HoGiaDinhID IS NULL')
    //   .skip((page - 1) * pageSize)
    //   .take(pageSize)
    //   .leftJoinAndSelect('taiLieu.NguoiTaoID', 'user') // Join với bảng User
    //   .leftJoinAndSelect('taiLieu.LoaiTaiLieu', 'loaiTaiLieu') // Join với bảng LoaiTaiLieu
    //   .leftJoinAndSelect('taiLieu.DonViID', 'donVi')
    //   // .leftJoinAndSelect('taiLieu.NguoiChinhSuaID', 'user')
    //   .getMany();

    const taiLieuList = await query.getMany();
    // console.log('taiLieuList', taiLieuList);

    const taiLieuCount = await queryCount.getCount();

    return { taiLieuList, taiLieuCount };
  }
}
