import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BangDanToc,
  BangDanhSachDieuTra,
  BangDonVi,
  BangDotRaSoat,
  BangHuyen,
  BangKhuVucRaSoat,
  BangPhanLoaiHo,
  BangTenTruongThongTinTVH,
  BangThon,
  BangThongTinChuHo,
  BangThongTinHo,
  BangThongTinThanhVienHo,
  BangTinh,
  BangTruongThongTinHo,
  BangUser,
  BangXa,
} from 'src/utils/typeorm';
import { Brackets, Repository } from 'typeorm';
import { format } from 'date-fns';
import { UpdateChuHoDto } from './dtos/updateChuHoGiaDinh.dto';
import { CreateTruongThongTinHoDto } from './dtos/createTenTruongThongTinHo.dto';
import { SaveChangesDto } from './dtos/saveChanges.dto';
import { UpdateTenTruongThongTinDto } from './dtos/updateTenTruongThongTin.dto';
import { SaveChangesMemberDto } from './dtos/saveChangesMember.dto';
import { SaveChangesDacDiemHoDto } from './dtos/saveChangeDacDiemHo.dto';
import * as exceljs from 'exceljs';
import * as xlsx from 'xlsx';

const template = [
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Thông tin chung',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 1,
    TruongThongTinChaID: null,
  },
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Họ và tên',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 2,
    TruongThongTinChaID: 1,
  },
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'CMND/CCCD',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 3,
    TruongThongTinChaID: 1,
  },
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Dân tộc',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 4,
    TruongThongTinChaID: 1,
  },
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Ngày sinh',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 5,
    TruongThongTinChaID: 1,
  },
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Giới tính',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 6,
    TruongThongTinChaID: 1,
  },
  {
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'QH với chủ hộ',
    ThoiGianTao: '2023-10-05T02:02:44.000Z',
    TruongThongTinID: 7,
    TruongThongTinChaID: null,
  },
  {
    MaTT: '',
    GiaTri: null,
    IsRemoved: false,
    isSelected: true,
    TenTruongTT: 'Chủ hộ',
    ThoiGianTao: '2023-10-05T02:05:33.000Z',
    selectedValue: 'Chủ hộ',
    NguoiChinhSuaID: null,
    ThoiGianCapNhat: null,
    TruongThongTinID: 8,
    TruongThongTinChaID: 7,
  },
  {
    MaTT: '',
    GiaTri: null,
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Con',
    ThoiGianTao: '2023-10-05T02:05:33.000Z',
    selectedValue: null,
    NguoiChinhSuaID: null,
    ThoiGianCapNhat: null,
    TruongThongTinID: 9,
    TruongThongTinChaID: 7,
  },
  {
    MaTT: '',
    GiaTri: null,
    IsRemoved: false,
    isSelected: false,
    TenTruongTT: 'Vợ/chồng',
    ThoiGianTao: '2023-10-05T02:05:33.000Z',
    selectedValue: null,
    NguoiChinhSuaID: null,
    ThoiGianCapNhat: null,
    TruongThongTinID: 10,
    TruongThongTinChaID: 7,
  },
];
@Injectable()
export class QuanLyHoGiaDinhService {
  constructor(
    @InjectRepository(BangThongTinChuHo)
    private readonly bangThongTinChuHoRepository: Repository<BangThongTinChuHo>,
    @InjectRepository(BangTruongThongTinHo)
    private readonly bangTruongThongTinHoRepository: Repository<BangTruongThongTinHo>,
    @InjectRepository(BangTenTruongThongTinTVH)
    private readonly bangTenTruongThongTinTVHRepository: Repository<BangTenTruongThongTinTVH>,
    @InjectRepository(BangUser)
    private readonly bangUserRepository: Repository<BangUser>,
    @InjectRepository(BangThongTinHo)
    private readonly bangThongTinHoRepository: Repository<BangThongTinHo>,
    @InjectRepository(BangDanhSachDieuTra)
    private readonly bangDSDTRepository: Repository<BangDanhSachDieuTra>,
    @InjectRepository(BangDotRaSoat)
    private readonly bangDotRaSoatRepository: Repository<BangDotRaSoat>,
    @InjectRepository(BangThongTinThanhVienHo)
    private readonly thanhVienRepository: Repository<BangThongTinThanhVienHo>,
    @InjectRepository(BangTinh)
    private readonly bangTinhRepository: Repository<BangTinh>,
    @InjectRepository(BangHuyen)
    private readonly bangHuyenRepository: Repository<BangHuyen>,
    @InjectRepository(BangXa)
    private readonly bangXaRepository: Repository<BangXa>,
    @InjectRepository(BangThon)
    private readonly bangThonRepository: Repository<BangThon>,
    @InjectRepository(BangDanToc)
    private readonly bangDanTocRepository: Repository<BangDanToc>,
    @InjectRepository(BangKhuVucRaSoat)
    private readonly bangKhuVucRaSoatRepository: Repository<BangKhuVucRaSoat>,
    @InjectRepository(BangPhanLoaiHo)
    private readonly bangPhanLoaiHoRepository: Repository<BangPhanLoaiHo>,
    @InjectRepository(BangDonVi)
    private readonly bangDonViHoRepository: Repository<BangDonVi>,
  ) {}

  async updateThongTinChuHo(chuHoID: number, updateChuHoDto: UpdateChuHoDto) {
    const chuHo = await this.bangThongTinChuHoRepository.findOne(chuHoID);
    if (!chuHo) {
      throw new NotFoundException('Không tìm thấy thông tin chủ hộ');
    }

    const thanhVien = await this.thanhVienRepository.findOne({
      where: { ChuHoID: chuHoID },
    });
    // console.log('thanhVien', thanhVien);
    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thông tin thành viên');
    }

    // Cập nhật thông tin chủ hộ với dữ liệu từ DTO
    chuHo.HoVaTenChuHo = updateChuHoDto.HoVaTenChuHo;
    chuHo.CmndCccd = updateChuHoDto.CmndCccd;
    chuHo.DanTocID = updateChuHoDto.DanTocID;
    chuHo.GioiTinh = updateChuHoDto.GioiTinh;
    chuHo.NgaySinh = updateChuHoDto.NgaySinh;
    chuHo.SDT = updateChuHoDto.SDT;

    thanhVien.HoVaTen = updateChuHoDto.HoVaTenChuHo;
    thanhVien.CmndCccd = updateChuHoDto.CmndCccd;
    thanhVien.DanTocID = updateChuHoDto.DanTocID;
    thanhVien.GioiTinh = updateChuHoDto.GioiTinh;
    thanhVien.NgaySinh = updateChuHoDto.NgaySinh;
    thanhVien.SDT = updateChuHoDto.SDT;

    // Lưu thông tin chủ hộ đã cập nhật vào cơ sở dữ liệu
    return {
      bangThongTinChuHo: await this.bangThongTinChuHoRepository.save(chuHo),
      thanhVien: await this.thanhVienRepository.save(thanhVien),
    };
  }

  async getDacDiemThongTinHo(HoGiaDinhID: number): Promise<BangThongTinHo> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    try {
      const dataFromDatabase = await this.bangThongTinHoRepository
        .createQueryBuilder('truongThongTinHo')
        .select('truongThongTinHo.DacDiemHoGiaDinh')
        .where('truongThongTinHo.HoGiaDinhID = :HoGiaDinhID', { HoGiaDinhID })
        .getOne();

      return dataFromDatabase;
    } catch (error) {
      // Xử lý lỗi nếu có
      // console.error('Error fetching data from database:', error);
      throw new HttpException('Lỗi không có dữ liệu', HttpStatus.NOT_FOUND);
    }
  }

  async getAllTruongThongTinHo(): Promise<BangTruongThongTinHo[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase = await this.bangTruongThongTinHoRepository
      .createQueryBuilder('truongThongTinHo')
      .where('truongThongTinHo.IsRemoved = :IsRemoved', { IsRemoved: false })
      .getMany();
    // Lưu trong 1 giờ
    return dataFromDatabase;
  }

  async getAllTenTruongThongTinHo(): Promise<BangTruongThongTinHo[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase = await this.bangTruongThongTinHoRepository.find();
    // Lưu trong 1 giờ
    return dataFromDatabase;
  }

  async getAllTruongThongTinTV(): Promise<BangTenTruongThongTinTVH[]> {
    // Nếu không có dữ liệu trong cache, truy vấn cơ sở dữ liệu và lưu vào cache
    const dataFromDatabase =
      await this.bangTenTruongThongTinTVHRepository.find();
    // Lưu trong 1 giờ
    return dataFromDatabase;
  }

  async createTruongThongTinHo(
    createTruongThongTinHoDto: CreateTruongThongTinHoDto,
    userId: number,
  ): Promise<BangTruongThongTinHo> {
    // console.log('userId', userId);

    const user = await this.bangUserRepository.findOne(userId, {
      relations: ['RoleGroupID', 'CanBoID', 'DanTocID'],
    });
    // console.log('user: ' + user);
    // return user;
    if (!user) {
      throw new HttpException(
        'Không có dữ liệu người dùng',
        HttpStatus.NOT_FOUND,
      );
    }

    const newTruongThongTinHo = new BangTruongThongTinHo();
    newTruongThongTinHo.TenTruongThongTin =
      createTruongThongTinHoDto.TenTruongThongTin;
    newTruongThongTinHo.TruongThongTinChaID =
      createTruongThongTinHoDto.TruongThongTinChaID;
    newTruongThongTinHo.NguoiTaoID = user.UserID;

    const saved = await this.bangTruongThongTinHoRepository.save(
      newTruongThongTinHo,
    );
    return saved;
  }

  async deleteMultiple(ids: number[]) {
    await this.bangTruongThongTinHoRepository
      .createQueryBuilder()
      .update(BangTruongThongTinHo) // Thay thế `BangTruongThongTinHoEntity` bằng tên thực thể thực sự của bạn
      .set({ IsRemoved: true }) // Cập nhật trường IsRemoved thành true
      .whereInIds(ids) // Lọc theo danh sách ids
      .execute();
  }

  async deleteMultipleTvHo(ids: number[]) {
    await this.bangTenTruongThongTinTVHRepository
      .createQueryBuilder()
      .update(BangTenTruongThongTinTVH) // Thay thế `BangTruongThongTinHoEntity` bằng tên thực thể thực sự của bạn
      .set({ IsRemoved: true }) // Cập nhật trường IsRemoved thành true
      .whereInIds(ids) // Lọc theo danh sách ids
      .execute();
  }

  async deleteTruongThongTinHo(truongThongTinID: number): Promise<boolean> {
    // Tìm trường thông tin dựa trên ban
    const truongThongTin = await this.bangTruongThongTinHoRepository.findOne(
      truongThongTinID,
    );

    if (!truongThongTin) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${truongThongTinID}`,
      );
    }

    // Xóa trường thông tin
    truongThongTin.IsRemoved = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await this.bangTruongThongTinHoRepository.save(truongThongTin);

    return true; // Hoặc bạn có thể trả về thông tin khác để xác định rằng xóa thành công
  }

  // async saveChangeDacDiemHo(
  //   saveChangesDto: SaveChangesDacDiemHoDto,
  //   HoGiaDinhID: number,
  // ) {
  //   // const user = await this.bangUserRepository.findOne(userId);

  //   const hoGiaDinh = await this.bangThongTinHoRepository.findOne(HoGiaDinhID);
  //   if (!hoGiaDinh) {
  //     throw new NotFoundException(`Không tìm thấy thông tin hộ`);
  //   }

  //   hoGiaDinh.DacDiemHoGiaDinh = saveChangesDto.DacDiemHoGiaDinh;

  //   return await this.bangThongTinHoRepository.save(hoGiaDinh);
  // }

  async saveChangeDacDiemHo(
    saveChangesDto: SaveChangesDacDiemHoDto,
    HoGiaDinhID: number,
  ) {
    const hoGiaDinh = await this.bangThongTinHoRepository.findOne(HoGiaDinhID);
    if (!hoGiaDinh) {
      throw new NotFoundException(`Không tìm thấy thông tin hộ`);
    }

    const currentDatetime = new Date();

    if (!hoGiaDinh.DacDiemHoGiaDinh) {
      hoGiaDinh.DacDiemHoGiaDinh = {};
    }

    // Thêm dữ liệu mới hoặc cập nhật giá trị mới vào DacDiemHoGiaDinh
    const formattedDatetime = format(currentDatetime, 'dd/MM/yyyy-HH:mm');
    hoGiaDinh.DacDiemHoGiaDinh[formattedDatetime] =
      saveChangesDto.DacDiemHoGiaDinh;
    // console.log('hoGD', hoGiaDinh);

    return await this.bangThongTinHoRepository.save(hoGiaDinh);
  }

  async saveChanges(
    saveChangesDto: SaveChangesDto,
    userId: number,
    // HoGiaDinhID: number,
  ) {
    const user = await this.bangUserRepository.findOne(userId);

    const saveChangesArray = Object.values(saveChangesDto);
    // console.log('saveChanges', saveChangesArray);

    // Bước 1: Truy vấn các TenTruongThongTin hiện có từ database
    const existingEntities = await this.bangTruongThongTinHoRepository.find({
      select: ['TenTruongThongTin', 'TruongThongTinChaID'], // Chỉ lấy trường TenTruongThongTin
    });

    // Bước 2: So sánh và lọc ra các trường mới
    const newEntities = saveChangesArray.filter((dto) => {
      return !existingEntities.some((existingEntity) => {
        return (
          existingEntity.TenTruongThongTin === dto.TenTruongThongTin &&
          existingEntity.TruongThongTinChaID === dto.TruongThongTinChaID
        );
      });
    });

    // Bước 3: Thêm các trường mới vào database
    const updatedEntities = [];

    for (const dto of newEntities) {
      const { TenTruongThongTin, TruongThongTinChaID } = dto;

      const truongThongTin = new BangTruongThongTinHo();
      truongThongTin.TenTruongThongTin = TenTruongThongTin;
      truongThongTin.TruongThongTinChaID = TruongThongTinChaID;
      truongThongTin.NguoiTaoID = user.UserID;

      // Lưu thay đổi vào database
      const newEntity = await this.bangTruongThongTinHoRepository.save(
        truongThongTin,
      );

      updatedEntities.push(newEntity);
    }

    // Bước 4: Trả về các trường đã được thêm mới
    return updatedEntities;
  }

  async saveChangesTVHo(saveChangesMemberDto: SaveChangesMemberDto) {
    const saveChangesArray = Object.values(saveChangesMemberDto);
    // console.log('saveChanges', saveChangesArray);
    // Bước 1: Truy vấn các TenTruongThongTin hiện có từ database
    const existingEntities = await this.bangTenTruongThongTinTVHRepository.find(
      {
        select: ['TenTruongTT', 'TruongThongTinChaID'], // Chỉ lấy trường TenTruongThongTin
      },
    );

    // Bước 2: So sánh và lọc ra các trường mới
    const newEntities = saveChangesArray.filter((dto) => {
      return !existingEntities.some((existingEntity) => {
        return (
          existingEntity.TenTruongTT === dto.TenTruongTT &&
          existingEntity.TruongThongTinChaID === dto.TruongThongTinChaID
        );
      });
    });

    // Bước 3: Thêm các trường mới vào database
    const updatedEntities = [];

    for (const dto of newEntities) {
      const { TenTruongTT, TruongThongTinChaID, MaTT, NguoiTaoID } = dto;

      const truongThongTin = new BangTenTruongThongTinTVH();
      truongThongTin.TruongThongTinChaID = TruongThongTinChaID;
      truongThongTin.TenTruongTT = TenTruongTT;
      truongThongTin.MaTT = MaTT;
      truongThongTin.NguoiTaoID = NguoiTaoID;

      // Lưu thay đổi vào database
      const newEntity = await this.bangTenTruongThongTinTVHRepository.save(
        truongThongTin,
      );

      updatedEntities.push(newEntity);
    }

    // Bước 4: Trả về các trường đã được thêm mới
    return updatedEntities;
  }

  async updateMultipleGhiChuAndGiaTri(
    updateRequests: {
      id: number;
      fieldName: string;
      value: string;
      NguoiChinhSuaID: number;
    }[],
    removalRequests: [], // Mảng ID cần được đặt IsRemoved thành true
  ): Promise<BangTruongThongTinHo[]> {
    const updatedRecords: BangTruongThongTinHo[] = [];

    // Xác định các bản ghi cần đặt IsRemoved thành true
    for (const request of removalRequests) {
      const { id, value } = request;
      try {
        const truongThongTinHo =
          await this.bangTruongThongTinHoRepository.findOne({
            TruongThongTinID: id, // Chuyển đổi id thành số nguyên
          });

        if (truongThongTinHo) {
          // Cập nhật trạng thái dựa trên giá trị boolean
          truongThongTinHo.isActive = value;

          const updatedRecord = await this.bangTruongThongTinHoRepository.save(
            truongThongTinHo,
          );
          updatedRecords.push(updatedRecord);
        }
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error(`Lỗi khi cập nhật bản ghi với ID ${id}:`, error);
      }
    }

    // Tiếp tục xử lý các cập nhật khác như trước
    for (const updateRequest of updateRequests) {
      const { id, fieldName, value, NguoiChinhSuaID } = updateRequest;

      // Tìm đối tượng cần cập nhật dựa trên id
      const truongThongTinHo =
        await this.bangTruongThongTinHoRepository.findOne(id);

      if (!truongThongTinHo) {
        throw new NotFoundException(
          `Không tìm thấy trường thông tin với ID ${id}`,
        );
      }

      // Cập nhật tương ứng dựa trên fieldName nếu không phải 'IsRemoved'
      if (fieldName === 'GhiChu') {
        truongThongTinHo.GhiChu = value;
      } else if (fieldName === 'GiaTri') {
        truongThongTinHo.GiaTri = value;
      } else if (fieldName === 'TenTruongThongTin') {
        truongThongTinHo.TenTruongThongTin = value;
      }
      truongThongTinHo.NguoiChinhSuaID = NguoiChinhSuaID;

      // Lưu thay đổi vào cơ sở dữ liệu
      const updatedRecord = await this.bangTruongThongTinHoRepository.save(
        truongThongTinHo,
      );

      updatedRecords.push(updatedRecord);
    }

    return updatedRecords;
  }

  async updateTruongMember(
    updateRequests: {
      id: number;
      fieldName: string;
      value: string;
      NguoiChinhSuaID: number;
    }[],
  ): Promise<BangTenTruongThongTinTVH[]> {
    const updatedRecords: BangTenTruongThongTinTVH[] = [];

    for (const updateRequest of updateRequests) {
      const { id, fieldName, value, NguoiChinhSuaID } = updateRequest;

      // Tìm đối tượng cần cập nhật dựa trên id
      const truongThongTinHo =
        await this.bangTenTruongThongTinTVHRepository.findOne(id);

      if (!truongThongTinHo) {
        throw new NotFoundException(
          `Không tìm thấy trường thông tin với ID ${id}`,
        );
      }

      // Cập nhật tương ứng dựa trên fieldName
      if (fieldName === 'MaTT') {
        truongThongTinHo.MaTT = value;
      } else if (fieldName === 'TenTruongTT') {
        truongThongTinHo.TenTruongTT = value;
      }
      truongThongTinHo.NguoiChinhSuaID = NguoiChinhSuaID;

      // Lưu thay đổi vào cơ sở dữ liệu
      const updatedRecord = await this.bangTenTruongThongTinTVHRepository.save(
        truongThongTinHo,
      );

      updatedRecords.push(updatedRecord);
    }

    return updatedRecords;
  }

  async updateTruongFamily(
    updateRequests: { id: number; fieldName: string; value: string }[],
  ): Promise<BangTruongThongTinHo[]> {
    const updatedRecords: BangTruongThongTinHo[] = [];

    for (const updateRequest of updateRequests) {
      // console.log('updateRequest', updateRequest);

      const { id, fieldName, value } = updateRequest;

      // Tìm đối tượng cần cập nhật dựa trên id
      const truongThongTinHo =
        await this.bangTruongThongTinHoRepository.findOne(id);

      if (!truongThongTinHo) {
        throw new NotFoundException(
          `Không tìm thấy trường thông tin với ID ${id}`,
        );
      }

      // Cập nhật tương ứng dựa trên fieldName
      if (fieldName === 'TenTruongThongTin') {
        truongThongTinHo.TenTruongThongTin = value;
      }

      // Lưu thay đổi vào cơ sở dữ liệu
      const updatedRecord = await this.bangTruongThongTinHoRepository.save(
        truongThongTinHo,
      );

      updatedRecords.push(updatedRecord);
    }

    return updatedRecords;
  }

  async selectMaTT(): Promise<BangTenTruongThongTinTVH[]> {
    const MaTT = await this.bangTenTruongThongTinTVHRepository.find({
      select: ['TenTruongTT', 'MaTT'],
    });
    return MaTT;
  }

  async deleteTruongThongTinTVH(truongThongTinID: number): Promise<boolean> {
    // Tìm trường thông tin dựa trên ban
    const truongThongTin =
      await this.bangTenTruongThongTinTVHRepository.findOne(truongThongTinID);

    if (!truongThongTin) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${truongThongTinID}`,
      );
    }

    // Xóa trường thông tin
    truongThongTin.IsRemoved = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await this.bangTruongThongTinHoRepository.save(truongThongTin);

    return true; // Hoặc bạn có thể trả về thông tin khác để xác định rằng xóa thành công
  }

  async createChuHo(chuHo: any) {
    const result = await this.bangThongTinChuHoRepository.create(chuHo);
    const saved = await this.bangThongTinChuHoRepository.save(result);
    return saved;
  }

  async createHoGiaDinh(hoGiaDinhDetails: any) {
    console.log('xuong ho gia dinh lan nua nao: ', hoGiaDinhDetails);

    const checkExis = await this.bangThongTinHoRepository
      .createQueryBuilder('hoGiaDinh')
      .where('hoGiaDinh.MaHo = :id', {
        id: hoGiaDinhDetails.MaHo,
      })
      .andWhere('hoGiaDinh.IsRemoved = :isRemoved', { isRemoved: false })
      .getOne();
    // console.log('getHoGiaDinh: ', getHoGiaDinh);
    const checkThanhVienTheoCCCD = await this.thanhVienRepository
      .createQueryBuilder('thanhVien')
      .where('thanhVien.CmndCccd = :cmndCccd', {
        cmndCccd: hoGiaDinhDetails.CmndCccd,
      })
      .getOne();

    if (checkThanhVienTheoCCCD) {
      throw new HttpException('CCCD này đã có người dùng', HttpStatus.CONFLICT);
    }
    if (checkExis) {
      throw new HttpException('Mã hộ đã tồn tại', HttpStatus.CONFLICT);
    }
    const newHoGiaDinh = await this.bangThongTinHoRepository.create(
      hoGiaDinhDetails,
    );
    const savedHoGiaDinh = await this.bangThongTinHoRepository.save(
      newHoGiaDinh,
    );

    return savedHoGiaDinh;
  }

  async getAllHoGiaDinh(queryParams: any) {
    // const result = await this.bangThongTinHoRepository.find();
    // console.log('result: ');
    console.log('queryParams trong tim kiem: ', queryParams);
    const page = queryParams.page;
    const pageSize = 5;
    // const searchKey = queryParams.searchKey.toLowerCase();
    const searchKey = queryParams.searchKey
      ? encodeURIComponent(queryParams.searchKey.toLowerCase())
      : '';
    const typeSort = queryParams.typeSort;
    const fieldSort = queryParams.fieldSort;
    const dotRaSoatID = queryParams.dotRaSoatID;
    const donViID = queryParams.donViID;
    const khuVucRaSoatID = queryParams.khuVucRaSoatID;
    // console.log('page: ', page);

    const queryAll = await this.bangThongTinHoRepository
      .createQueryBuilder('hoGiaDinh')
      .where('hoGiaDinh.IsRemoved = :isRemoved', { isRemoved: false })
      .leftJoinAndSelect('hoGiaDinh.TinhID', 'tinh')
      .leftJoinAndSelect('hoGiaDinh.HuyenID', 'huyen')
      .leftJoinAndSelect('hoGiaDinh.XaID', 'xa')
      .leftJoinAndSelect('hoGiaDinh.ThonID', 'thon')
      .leftJoinAndSelect('hoGiaDinh.DonViID', 'donvi')
      .leftJoinAndSelect('hoGiaDinh.KhuVucRaSoatID', 'khuvuc')
      .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanloai')
      .getMany();

    const query = this.bangThongTinHoRepository
      .createQueryBuilder('hoGiaDinh')
      .where('hoGiaDinh.IsRemoved = :isRemoved', { isRemoved: false })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .leftJoinAndSelect('hoGiaDinh.TinhID', 'tinh')
      .leftJoinAndSelect('hoGiaDinh.HuyenID', 'huyen')
      .leftJoinAndSelect('hoGiaDinh.XaID', 'xa')
      .leftJoinAndSelect('hoGiaDinh.ThonID', 'thon')
      .leftJoinAndSelect('hoGiaDinh.DonViID', 'donvi')
      .leftJoinAndSelect('hoGiaDinh.KhuVucRaSoatID', 'khuvuc')
      .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanloai');
    if (searchKey) {
      const hoGiaDinhIds = await this.bangThongTinChuHoRepository
        .createQueryBuilder('chuHo')
        .select('DISTINCT chuHo.HoGiaDinhID')
        .where('chuHo.HoVaTenChuHo LIKE :searchKey', {
          searchKey: `%${searchKey.toLowerCase()}%`,
        })
        .getRawMany();

      if (hoGiaDinhIds.length > 0) {
        query.andWhere('hoGiaDinh.HoGiaDinhID IN (:...hoGiaDinhIds)', {
          hoGiaDinhIds: hoGiaDinhIds.map((item) => item.HoGiaDinhID),
        });
      } else {
        query.andWhere('hoGiaDinh.MaHo LIKE :searchKey', {
          searchKey: `%${searchKey.toLowerCase()}%`,
        });
      }
    }

    if (typeSort && (typeSort === 'ASC' || typeSort === 'DESC')) {
      query.orderBy(`hoGiaDinh.${fieldSort}`, typeSort as 'ASC' | 'DESC');
    }

    if (Number(dotRaSoatID)) {
      const danhSachIDHoInDanhSachDieuTra = await this.bangDSDTRepository
        .createQueryBuilder('bangDanhSachDieuTra')
        .select(['bangDanhSachDieuTra.DanhSachHo'])
        .where('bangDanhSachDieuTra.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: dotRaSoatID,
        })
        .getMany();
      const idHoGiaDinh = Array.from(
        new Set(
          danhSachIDHoInDanhSachDieuTra.flatMap((item) => item.DanhSachHo),
        ),
      );
      // console.log('idHoGiaDinh: ', idHoGiaDinh);
      if (idHoGiaDinh.length) {
        query.andWhere('hoGiaDinh.HoGiaDinhID IN (:...idHoGiaDinh)', {
          idHoGiaDinh,
        });
      } else {
        return { hoGiaDinhList: [], hoGiaDinhCount: 0, queryAll };
      }
    }

    if (Number(donViID)) {
      query.andWhere('donvi.DonViID = :DonViID', {
        DonViID: donViID,
      });
    }

    if (Number(khuVucRaSoatID)) {
      query.andWhere('khuvuc.KhuVucRaSoatID = :KhuVucRaSoatID', {
        KhuVucRaSoatID: khuVucRaSoatID,
      });
    }

    const queryCount = this.bangThongTinHoRepository
      .createQueryBuilder('hoGiaDinh')
      .where('hoGiaDinh.IsRemoved = :isRemoved', { isRemoved: false })
      .leftJoinAndSelect('hoGiaDinh.TinhID', 'tinh')
      .leftJoinAndSelect('hoGiaDinh.HuyenID', 'huyen')
      .leftJoinAndSelect('hoGiaDinh.XaID', 'xa')
      .leftJoinAndSelect('hoGiaDinh.ThonID', 'thon')
      .leftJoinAndSelect('hoGiaDinh.DonViID', 'donvi')
      .leftJoinAndSelect('hoGiaDinh.KhuVucRaSoatID', 'khuvuc')
      .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanloai');
    if (searchKey) {
      // queryCount.andWhere('hoGiaDinh.MaHo LIKE :searchKey', {
      //   searchKey: `%${searchKey.toLowerCase()}%`,
      // });
      const hoGiaDinhIds = await this.bangThongTinChuHoRepository
        .createQueryBuilder('chuHo')
        .select('DISTINCT chuHo.HoGiaDinhID')
        .where('chuHo.HoVaTenChuHo LIKE :searchKey', {
          searchKey: `%${searchKey.toLowerCase()}%`,
        })
        .getRawMany();

      if (hoGiaDinhIds.length > 0) {
        queryCount.andWhere('hoGiaDinh.HoGiaDinhID IN (:...hoGiaDinhIds)', {
          hoGiaDinhIds: hoGiaDinhIds.map((item) => item.HoGiaDinhID),
        });
      } else {
        queryCount.andWhere('hoGiaDinh.MaHo LIKE :searchKey', {
          searchKey: `%${searchKey.toLowerCase()}%`,
        });
      }
    }

    if (Number(dotRaSoatID)) {
      const danhSachIDHoInDanhSachDieuTra = await this.bangDSDTRepository
        .createQueryBuilder('bangDanhSachDieuTra')
        .select(['bangDanhSachDieuTra.DanhSachHo'])
        .where('bangDanhSachDieuTra.DotRaSoatID = :dotRaSoatID', {
          dotRaSoatID: dotRaSoatID,
        })
        .getMany();
      const idHoGiaDinh = Array.from(
        new Set(
          danhSachIDHoInDanhSachDieuTra.flatMap((item) => item.DanhSachHo),
        ),
      );
      if (idHoGiaDinh.length) {
        queryCount.andWhere('hoGiaDinh.HoGiaDinhID IN (:...idHoGiaDinh)', {
          idHoGiaDinh,
        });
      } else {
        return { hoGiaDinhList: [], hoGiaDinhCount: 0, queryAll };
      }
    }

    if (Number(donViID)) {
      queryCount.andWhere('donvi.DonViID = :DonViID', {
        DonViID: donViID,
      });
    }

    if (Number(khuVucRaSoatID)) {
      queryCount.andWhere('khuvuc.KhuVucRaSoatID = :KhuVucRaSoatID', {
        KhuVucRaSoatID: khuVucRaSoatID,
      });
    }

    const hoGiaDinhList = await query.getMany();
    for (const item of hoGiaDinhList) {
      const hoGiaDinhID = item.HoGiaDinhID;
      // console.log('hoGiaDinhID: ', hoGiaDinhID);

      const result = await this.bangThongTinChuHoRepository
        .createQueryBuilder('chuHo')
        .select(['chuHo.HoVaTenChuHo'])
        .where('chuHo.IsRemoved = :isRemoved', { isRemoved: false })
        .andWhere('chuHo.HoGiaDinhID = :hoGiaDinhID', { hoGiaDinhID })
        .getOne();
      // console.log('result: ', result);

      item['HoVaTenChuHo'] = result ? result.HoVaTenChuHo : '';
    }
    const hoGiaDinhCount = await queryCount.getCount();
    // console.log('danhSachHoGiaDinh: ', hoGiaDinhList);

    return { hoGiaDinhList: hoGiaDinhList, hoGiaDinhCount, queryAll };
  }

  async getDetailHoGiaDinh(HoGiaDinhID: number) {
    const getHoGiaDinh = await this.bangThongTinHoRepository
      .createQueryBuilder('hoGiaDinh')
      .where('hoGiaDinh.HoGiaDinhID = :id', { id: HoGiaDinhID })
      .leftJoinAndSelect('hoGiaDinh.TinhID', 'tinh')
      .leftJoinAndSelect('hoGiaDinh.HuyenID', 'huyen')
      .leftJoinAndSelect('hoGiaDinh.XaID', 'xa')
      .leftJoinAndSelect('hoGiaDinh.ThonID', 'thon')
      .leftJoinAndSelect('hoGiaDinh.DonViID', 'donvi')
      .leftJoinAndSelect('hoGiaDinh.KhuVucRaSoatID', 'khuvuc')
      .leftJoinAndSelect('hoGiaDinh.PhanLoaiHoID', 'phanLoaiHo')

      .getOne();

    return getHoGiaDinh;
  }

  async editHoGiaDinh(hoGiaDinhEdit: any) {
    const hoGiaDinh = await this.bangThongTinHoRepository.findOne(
      hoGiaDinhEdit.HoGiaDinhID,
    );
    if (!hoGiaDinh) {
      throw new NotFoundException(`Không tìm thấy thông tin hộ`);
    }

    hoGiaDinh.TinhID = hoGiaDinhEdit.TinhID;
    hoGiaDinh.XaID = hoGiaDinhEdit.XaID;
    hoGiaDinh.HuyenID = hoGiaDinhEdit.HuyenID;
    hoGiaDinh.KhuVucRaSoatID = hoGiaDinhEdit.KhuVucRaSoatID;
    hoGiaDinh.DonViID = hoGiaDinhEdit.DonViID;
    hoGiaDinh.PhanLoaiHoID = hoGiaDinhEdit.PhanLoaiHoID;
    hoGiaDinh.DiaChi = hoGiaDinhEdit.DiaChi;
    hoGiaDinh.Status = hoGiaDinhEdit.Status;
    hoGiaDinh.ThonID = hoGiaDinhEdit.ThonID;
    hoGiaDinh.DiemB1 = hoGiaDinhEdit.DiemB1;
    hoGiaDinh.DiemB2 = hoGiaDinhEdit.DiemB2;
    hoGiaDinh.isCanNgheo = hoGiaDinhEdit.isCanNgheo;
    hoGiaDinh.isDTTS = hoGiaDinhEdit.isDTTS;
    hoGiaDinh.isKNLD = hoGiaDinhEdit.isKNLD;
    hoGiaDinh.isTVCCCM = hoGiaDinhEdit.isTVCCCM;
    hoGiaDinh.isThoatNgheo = hoGiaDinhEdit.isThoatNgheo;
    hoGiaDinh.DiemB1 = hoGiaDinhEdit.DiemB1;
    hoGiaDinh.DiemB2 = hoGiaDinhEdit.DiemB2;

    return this.bangThongTinHoRepository.save(hoGiaDinh);
  }

  async deleteOneHoGiaDinh(HoGiaDinhID: number) {
    const getHoGiaDinh = await this.bangThongTinHoRepository.findOne(
      HoGiaDinhID,
    );
    if (getHoGiaDinh) {
      getHoGiaDinh.IsRemoved = true;
      const saved = await this.bangThongTinHoRepository.save(getHoGiaDinh);
      return saved;
    }
  }

  async deleteManyHoGiaDinh(idHoGiaDinh: number[]) {
    // return console.log(idHoGiaDinh);
    const updatedQuery = await this.bangThongTinHoRepository
      .createQueryBuilder()
      .update(BangThongTinHo);
    updatedQuery.set({ IsRemoved: true }).whereInIds(idHoGiaDinh).execute();
  }

  async createDanhSachRaSoat(dataDanhSachRaSoat: any) {
    // console.log('dataDanhSachRaSoat: ', dataDanhSachRaSoat);
    const newDSDT = await this.bangDSDTRepository.create(dataDanhSachRaSoat);
    const savedHoGiaDinh = await this.bangDSDTRepository.save(newDSDT);

    return savedHoGiaDinh;
  }

  async getDataAtTime(hoGiaDinhId: number, time?: string) {
    const hoGiaDinh = await this.bangThongTinHoRepository.findOne(hoGiaDinhId);

    if (!hoGiaDinh) {
      throw new NotFoundException('Không tìm thấy thông tin hộ gia đình');
    }

    const dacDiemHoGiaDinh = hoGiaDinh.DacDiemHoGiaDinh;

    // Nếu không có thời gian được cung cấp, lấy thời gian mới nhất
    const targetTime = time ? time : this.getLatestTime(dacDiemHoGiaDinh);
    console.log('target', targetTime);

    if (!dacDiemHoGiaDinh || !dacDiemHoGiaDinh[targetTime]) {
      throw new NotFoundException(
        'Dữ liệu không tồn tại cho thời gian cung cấp',
      );
    }

    return dacDiemHoGiaDinh[targetTime];
  }

  async deleteDataAtTime(hoGiaDinhId: number, time: string) {
    const hoGiaDinh = await this.bangThongTinHoRepository.findOne(hoGiaDinhId);

    if (!hoGiaDinh) {
      throw new NotFoundException('Không tìm thấy thông tin hộ gia đình');
    }

    const dacDiemHoGiaDinh = hoGiaDinh.DacDiemHoGiaDinh;

    // Kiểm tra xem có tồn tại key time không
    if (dacDiemHoGiaDinh && dacDiemHoGiaDinh[time]) {
      // Nếu có, xóa key đó khỏi đối tượng
      delete dacDiemHoGiaDinh[time];

      // Lưu lại dữ liệu đã được cập nhật
      await this.bangThongTinHoRepository.save(hoGiaDinh);

      return { success: true, message: 'Xóa thành công' };
    } else {
      throw new NotFoundException('Key time không tồn tại');
    }
  }

  // Hàm để lấy thời gian mới nhất từ đối tượng DacDiemHoGiaDinh
  private getLatestTime(dacDiemHoGiaDinh: Record<string, any>): string | null {
    if (!dacDiemHoGiaDinh) {
      return null;
    }

    const times = Object.keys(dacDiemHoGiaDinh);
    if (times.length === 0) {
      return null;
    }
    // console.log('times', times);
    const dateObjects = times.map((time) => {
      const [datePart, timePart] = time.split('-');
      const [day, month, year] = datePart.split('/');
      const [hour, minute] = timePart.split(':');
      return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
    });
    // console.log('dateObjects', dateObjects);

    // times [
    //   '18/10/2023-08:59',
    //   '18/10/2023-09:05',
    //   '18/10/2023-09:06',
    //   '18/10/2023-09:09',
    //   '18/10/2023-10:19',
    //   '18/10/2023-10:29'
    // ]

    // Sắp xếp thời gian theo thứ tự giảm dần và lấy thời gian mới nhất
    const latestTime = dateObjects.sort((a, b) => b.getTime() - a.getTime())[0];
    // latest time: 18/10/2023-08:59
    const formattedDatetime = format(latestTime, 'dd/MM/yyyy-HH:mm');
    // console.log('latest time: ' + formattedDatetime);
    return formattedDatetime;
  }

  async getAllKeys(hoGiaDinhId: number) {
    const hoGiaDinh = await this.bangThongTinHoRepository.findOne(hoGiaDinhId);

    if (!hoGiaDinh) {
      throw new NotFoundException('Không tìm thấy thông tin hộ gia đình');
    }

    const dacDiemHoGiaDinh = hoGiaDinh.DacDiemHoGiaDinh;

    if (!dacDiemHoGiaDinh) {
      return []; // Hoặc bạn có thể xử lý theo cách khác tùy vào yêu cầu của bạn
    }
    // Lấy tất cả keys
    const keys = Object.keys(dacDiemHoGiaDinh);

    return keys;
  }

  async processExcelFile(file: any) {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues();

    const arrDataReplace = [];
    for (let i = 10; i < rows.length; i++) {
      const row = rows[i];
      if (row.length) {
        const getTinh = await this.bangTinhRepository.findOne({
          TenTinh: row[2]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getHuyen = await this.bangHuyenRepository.findOne({
          TenHuyen: row[3]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getXa = await this.bangXaRepository.findOne({
          TenXa: row[4]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getThon = await this.bangThonRepository.findOne({
          TenThon: row[5]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getKhuVuc = await this.bangKhuVucRaSoatRepository.findOne({
          TenKhuVuc: row[7]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getPhanLoaiHo = await this.bangPhanLoaiHoRepository.findOne({
          TenLoai: row[8]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getDonViQuanLy = await this.bangDonViHoRepository.findOne({
          TenDonVi: row[9]?.replace(/\s+/g, ' ')?.trim(),
        });
        const getDanToc = await this.bangDanTocRepository.findOne({
          TenDanToc: row[12]?.replace(/\s+/g, ' ')?.trim(),
        });

        const checkExis = await this.bangThongTinHoRepository
          .createQueryBuilder('hoGiaDinh')
          .where('hoGiaDinh.MaHo = :maHo', {
            maHo: row[1],
          })
          .andWhere('hoGiaDinh.IsRemoved = :isRemoved', { isRemoved: false })
          .getOne();
        if (checkExis) {
          arrDataReplace.push({
            HoGiaDinhID: checkExis.HoGiaDinhID,
            MaHo: row[1]?.replace(/\s+/g, ' ')?.trim(),
            DiaChi: row[6]?.replace(/\s+/g, ' ')?.trim(),
            TinhID: getTinh?.TinhID,
            HuyenID: getHuyen?.HuyenID,
            XaID: getXa?.XaID,
            ThonID: getThon?.ThonID,
            PhanLoaiHoID: getPhanLoaiHo?.PhanLoaiHoID,
            DonViID: getDonViQuanLy?.DonViID,
            KhuVucRaSoatID: getKhuVuc?.KhuVucRaSoatID,
            HoVaTenChuHo: row[10]?.replace(/\s+/g, ' ')?.trim(),
            CmndCccd: row[11] || '',
            DanTocID: getDanToc?.DanTocID,
            NgaySinh: row[13],
            GioiTinh: row[14],
          });
          // console.log('check exis: ', checkExis);
        } else {
          const data = {
            MaHo: row[1]?.replace(/\s+/g, ' ')?.trim(),
            DiaChi: row[6]?.replace(/\s+/g, ' ')?.trim(),
            TinhID: getTinh?.TinhID,
            HuyenID: getHuyen?.HuyenID,
            XaID: getXa?.XaID,
            ThonID: getThon?.ThonID,
            PhanLoaiHoID: getPhanLoaiHo?.PhanLoaiHoID,
            DonViID: getDonViQuanLy?.DonViID,
            KhuVucRaSoatID: getKhuVuc?.KhuVucRaSoatID,
          };

          const newHoGiaDinh = await this.bangThongTinHoRepository.create(data);
          const savedHoGiaDinh = await this.bangThongTinHoRepository.save(
            newHoGiaDinh,
          );
          const dataChuHo = {
            HoVaTenChuHo: row[10]?.replace(/\s+/g, ' ')?.trim(),
            CmndCccd: row[11] || '',
            DanTocID: getDanToc?.DanTocID,
            NgaySinh: row[13],
            GioiTinh: row[14],
            HoGiaDinhID: savedHoGiaDinh.HoGiaDinhID,
          };
          // console.log('dataChuho: ', dataChuHo);
          const newChuHo = await this.bangThongTinChuHoRepository.create(
            dataChuHo,
          );
          const savedChuHo = await this.bangThongTinChuHoRepository.save(
            newChuHo,
          );
          const currentDatetime = new Date();
          const formattedDatetime = format(currentDatetime, 'dd/MM/yyyy-HH:mm');
          // member.DacDiemThanhVien[formattedDatetime] =
          //   createMemberDto.DacDiemThanhVien;
          // console.log('savedChuHo: ', savedChuHo);
          const dataThanhVien = {
            HoVaTen: savedChuHo.HoVaTenChuHo,
            CmndCccd: savedChuHo.CmndCccd,
            DanTocID: savedChuHo.DanTocID,
            NgaySinh: savedChuHo.NgaySinh,
            GioiTinh: savedChuHo.GioiTinh,
            HoGiaDinhID: savedChuHo.HoGiaDinhID,
            DacDiemThanhVien: { [formattedDatetime]: template },
            ChuHoID: savedChuHo.ChuHoID,
          };
          const newThanhVienHo = await this.thanhVienRepository.create(
            dataThanhVien,
          );
          await this.thanhVienRepository.save(newThanhVienHo);
        }
      }
    }

    return { rows, arrDataReplace };
  }

  async editHoGiaDinhAndChuHoAndThanhVienHo(dataEdit: any) {
    console.log('dataEdit: ', dataEdit);
    const hoGiaDinh = await this.bangThongTinHoRepository.findOne(
      dataEdit.HoGiaDinhID,
    );
    // console.log('hoGiaDinh: ', hoGiaDinh);

    // if (hoGiaDinh) {
    // console.log('ho gia dinh: ', hoGiaDinh);
    hoGiaDinh.TinhID = dataEdit?.TinhID;
    hoGiaDinh.XaID = dataEdit?.XaID;
    hoGiaDinh.HuyenID = dataEdit?.HuyenID;
    hoGiaDinh.KhuVucRaSoatID = dataEdit?.KhuVucRaSoatID;
    hoGiaDinh.DonViID = dataEdit?.DonViID;
    hoGiaDinh.PhanLoaiHoID = dataEdit?.PhanLoaiHoID;
    hoGiaDinh.DiaChi = dataEdit?.DiaChi;
    hoGiaDinh.Status = 'Đang chờ';
    hoGiaDinh.ThonID = dataEdit?.ThonID;
    hoGiaDinh.DiemB1 = null;
    hoGiaDinh.DiemB2 = null;

    const hoGiaDinhSaved = await this.bangThongTinHoRepository.save(hoGiaDinh);
    // }
    const chuHo = await this.bangThongTinChuHoRepository
      .createQueryBuilder('chuHo')
      .where('chuHo.HoGiaDinhID = :idHoGiaDinh', {
        idHoGiaDinh: dataEdit.HoGiaDinhID,
      })
      .getOne();
    // console.log('chu ho: ', chuHo);

    // if (chuHo) {
    const thanhVien = await this.thanhVienRepository.findOne({
      where: { ChuHoID: chuHo.ChuHoID },
    });
    // console.log('thanhVien', thanhVien);

    //   // Cập nhật thông tin chủ hộ với dữ liệu từ DTO
    chuHo.HoVaTenChuHo = dataEdit?.HoVaTenChuHo;
    chuHo.CmndCccd = dataEdit?.CmndCccd || '';
    chuHo.DanTocID = dataEdit?.DanTocID;
    chuHo.GioiTinh = dataEdit?.GioiTinh;
    chuHo.NgaySinh = dataEdit?.NgaySinh;

    thanhVien.HoVaTen = dataEdit?.HoVaTenChuHo;
    thanhVien.CmndCccd = dataEdit?.CmndCccd || '';
    thanhVien.DanTocID = dataEdit?.DanTocID;
    thanhVien.GioiTinh = dataEdit?.GioiTinh;
    thanhVien.NgaySinh = dataEdit?.NgaySinh;
    const chuHosaved = await this.bangThongTinChuHoRepository.save(chuHo);
    const thanhVienHoSaved = await this.thanhVienRepository.save(thanhVien);
    return {
      hoGiaDinhSaved,
      chuHosaved,
      thanhVienHoSaved,
    };
    // }
    // return this.bangThongTinHoRepository.save(hoGiaDinh);
  }
}
