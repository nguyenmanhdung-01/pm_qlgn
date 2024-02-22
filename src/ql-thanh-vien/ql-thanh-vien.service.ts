import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BangDanToc,
  BangThongTinThanhVienHo,
  BangThongTinHo,
  BangThongTinChuHo,
} from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dtos/createMember.dto';
import { UpdateMemberDto } from './dtos/updateMember.dto';
import { format } from 'date-fns';

@Injectable()
export class QlThanhVienService {
  constructor(
    @InjectRepository(BangThongTinThanhVienHo)
    private readonly membersRepository: Repository<BangThongTinThanhVienHo>,
    @InjectRepository(BangDanToc)
    private readonly danTocRepository: Repository<BangDanToc>,
    @InjectRepository(BangThongTinHo)
    private readonly hoGiaDinhRepository: Repository<BangThongTinHo>,
    @InjectRepository(BangThongTinChuHo)
    private readonly chuhoRepository: Repository<BangThongTinChuHo>,
  ) {}

  async createThanhVien(
    createMemberDto: CreateMemberDto,
    DanTocID: number,
    HoGiaDinhID: number,
  ) {
    if (!createMemberDto) {
      throw new BadRequestException('Dữ liệu không được định nghĩa');
    }
    // console.log('createMemberDto', createMemberDto);

    const idDanToc = await this.danTocRepository.findOne(DanTocID);
    const idHoGD = await this.hoGiaDinhRepository.findOne(HoGiaDinhID);
    const member = new BangThongTinThanhVienHo();
    member.HoVaTen = createMemberDto.HoVaTen;
    member.CmndCccd = createMemberDto.CmndCccd;
    member.NgaySinh = createMemberDto.NgaySinh;
    member.SDT = createMemberDto.SDT;
    member.DanTocID = idDanToc.DanTocID;
    member.HoGiaDinhID = idHoGD.HoGiaDinhID;
    member.GioiTinh = createMemberDto.GioiTinh;
    member.ChuHoID = createMemberDto.ChuHoID;

    const currentDatetime = new Date();

    if (!member.DacDiemThanhVien) {
      member.DacDiemThanhVien = {};
    }

    // Thêm dữ liệu mới hoặc cập nhật giá trị mới vào DacDiemHoGiaDinh
    const formattedDatetime = format(currentDatetime, 'dd/MM/yyyy-HH:mm');
    member.DacDiemThanhVien[formattedDatetime] =
      createMemberDto.DacDiemThanhVien;

    return await this.membersRepository.save(member);
  }

  async editMember(idMember: number, UpdateMemberDto: UpdateMemberDto) {
    // console.log('UpdateMemberDto', UpdateMemberDto);

    const member = await this.membersRepository.findOne(idMember);
    if (!member) {
      throw new NotFoundException('Không tìm thấy thông tin thành viên');
    }

    member.HoVaTen = UpdateMemberDto.HoVaTen;
    member.CmndCccd = UpdateMemberDto.CmndCccd;
    member.DanTocID = UpdateMemberDto.DanTocID;
    member.NgaySinh = UpdateMemberDto.NgaySinh;
    member.SDT = UpdateMemberDto.SDT;
    member.GioiTinh = UpdateMemberDto.GioiTinh;
    const currentDatetime = new Date();

    if (!member.DacDiemThanhVien) {
      member.DacDiemThanhVien = {};
    }
    if (member.ChuHoID) {
      const chuHo = await this.chuhoRepository.findOne(member.ChuHoID);
      member.HoVaTen = UpdateMemberDto.HoVaTen;
      chuHo.CmndCccd = UpdateMemberDto.CmndCccd;
      chuHo.DanTocID = UpdateMemberDto.DanTocID;
      chuHo.NgaySinh = UpdateMemberDto.NgaySinh;
      chuHo.SDT = UpdateMemberDto.SDT;
      chuHo.GioiTinh = UpdateMemberDto.GioiTinh;
      await this.chuhoRepository.save(chuHo);
    }

    // Thêm dữ liệu mới hoặc cập nhật giá trị mới vào DacDiemHoGiaDinh
    const formattedDatetime = format(currentDatetime, 'dd/MM/yyyy-HH:mm');
    member.DacDiemThanhVien[formattedDatetime] =
      UpdateMemberDto.DacDiemThanhVien;

    return await this.membersRepository.save(member);
  }

  async getAllThanhVien(
    hoGiaDinhID: number,
  ): Promise<BangThongTinThanhVienHo[]> {
    const members = await this.membersRepository
      .createQueryBuilder('thanhVien')
      // .addSelect(['thanhVien.DacDiemThanhVien'])
      .where('thanhVien.HoGiaDinhID = :hoGiaDinhID', { hoGiaDinhID })
      .andWhere('thanhVien.IsRemoved = :isRemoved', { isRemoved: false })
      // .where({
      //   'thanhVien.HoGiaDinhID': hoGiaDinhID,
      //   'thanhVien.IsRemoved': false,
      // })
      .getMany();

    const membersWithLatestTime = members.map((thanhVien) => ({
      ...thanhVien,
      DacDiemThanhVien:
        thanhVien.DacDiemThanhVien[
          this.getLatestTime(thanhVien.DacDiemThanhVien)
        ],
    }));

    // console.log('membersWithLatestTime', membersWithLatestTime);

    return membersWithLatestTime;
  }

  private getLatestTime(dacDiemThanhVien: Record<string, any>): string | null {
    if (!dacDiemThanhVien) {
      return null;
    }

    const times = Object.keys(dacDiemThanhVien);
    if (times.length === 0) {
      return null;
    }

    // Sắp xếp thời gian theo thứ tự giảm dần và lấy thời gian mới nhất
    const dateObjects = times.map((time) => {
      const [datePart, timePart] = time?.split('-');
      const [day, month, year] = datePart?.split('/');
      const [hour, minute] = timePart?.split(':');
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

  async getSelectDacDiem(idTV: number, time?: string) {
    const thanhVien = await this.membersRepository.findOne(idTV);

    const dacDiemThanhVien = thanhVien.DacDiemThanhVien;

    const targetTime = time ? time : this.getLatestTime(dacDiemThanhVien);
    // const targetTime = this.getLatestTime(dacDiemThanhVien);

    if (!dacDiemThanhVien || !dacDiemThanhVien[targetTime]) {
      throw new NotFoundException(
        'Dữ liệu không tồn tại cho thời gian cung cấp',
      );
    }

    return dacDiemThanhVien[targetTime];
  }

  async getAllKeysTime(tvH: number) {
    const thanhVien = await this.membersRepository.findOne(tvH);

    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thông tin thành viên');
    }

    const dacDiemThanhVien = thanhVien.DacDiemThanhVien;

    if (!dacDiemThanhVien) {
      return []; // Hoặc bạn có thể xử lý theo cách khác tùy vào yêu cầu của bạn
    }
    // Lấy tất cả keys
    const keys = Object.keys(dacDiemThanhVien);

    return keys;
  }

  async getThanhVienByID(id: number): Promise<BangThongTinThanhVienHo> {
    return this.membersRepository.findOne(id, {
      relations: ['DanTocID', 'HoGiaDinhID'],
      select: ['HoVaTen', 'CmndCccd', 'GioiTinh', 'NgaySinh'], // Kết hợp các mối quan hệ
    });
  }

  // async getTVChuHo(idHoGD: number) {
  //   const thanhVien = await this.membersRepository.find({where:{HoGiaDinhID: idHoGD}});

  //   const dacDiemThanhVien = thanhVien.DacDiemThanhVien;

  //   const targetTime = this.getLatestTime(dacDiemThanhVien);
  //   // const targetTime = this.getLatestTime(dacDiemThanhVien);

  //   if (!dacDiemThanhVien || !dacDiemThanhVien[targetTime]) {
  //     throw new NotFoundException(
  //       'Dữ liệu không tồn tại cho thời gian cung cấp',
  //     );
  //   }

  //   return dacDiemThanhVien[targetTime];
  // }

  async deleteMultiple(ids: number[]) {
    await this.membersRepository
      .createQueryBuilder()
      .update(BangThongTinThanhVienHo) // Thay thế `BangTruongThongTinHoEntity` bằng tên thực thể thực sự của bạn
      .set({ IsRemoved: true }) // Cập nhật trường IsRemoved thành true
      .whereInIds(ids) // Lọc theo danh sách ids
      .execute();
  }

  async deleteTruongTTTV(truongThongTinID: number): Promise<boolean> {
    // Tìm trường thông tin dựa trên ban
    const truongThongTin = await this.membersRepository.findOne(
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
    await this.membersRepository.save(truongThongTin);

    return true; // Hoặc bạn có thể trả về thông tin khác để xác định rằng xóa thành công
  }

  async deleteDataAtTime(idTv: number, time: string) {
    const thanhVien = await this.membersRepository.findOne(idTv);

    if (!thanhVien) {
      throw new NotFoundException('Không tìm thấy thông tin thành viên');
    }

    const dacDiemThanhVien = thanhVien.DacDiemThanhVien;

    // Kiểm tra xem có tồn tại key time không
    if (dacDiemThanhVien && dacDiemThanhVien[time]) {
      // Kiểm tra số lượng đối tượng trong key `time`
      const count = Object.keys(dacDiemThanhVien).length;
      // console.log('count: ' + count);

      // Kiểm tra nếu số lượng đối tượng là lớn hơn 1 thì cho phép xóa
      if (count > 1) {
        // Nếu có, xóa key đó khỏi đối tượng
        delete dacDiemThanhVien[time];

        // Lưu lại dữ liệu đã được cập nhật
        await this.membersRepository.save(thanhVien);

        return { success: true, message: 'Xóa thành công' };
      } else {
        throw new BadRequestException(
          'Không thể xóa thông tin chi tiết cuối cùng',
        );
      }
    } else {
      throw new NotFoundException('Key time không tồn tại');
    }
  }
}
