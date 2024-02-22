import { BangThongTinThanhVienHo } from 'src/utils/typeorm';
import { CreateMemberDto } from './dtos/createMember.dto';
import { UpdateMemberDto } from './dtos/updateMember.dto';

export interface IQuanLyThanhVien {
  createThanhVien(
    createMemberDto: CreateMemberDto,
    DanTocID: number,
    HoGiaDinhID: number,
  );
  getAllThanhVien(hoGiaDinhID: number): Promise<BangThongTinThanhVienHo[]>;
  getThanhVienByID(id: number): Promise<BangThongTinThanhVienHo>;
  deleteMultiple(ids: number[]);
  deleteTruongTTTV(truongThongTinID: number);
  getSelectDacDiem(idTV: number, time?: string);
  editMember(idMember: number, UpdateMemberDto: UpdateMemberDto);
  getAllKeysTime(tvH: number);
  deleteDataAtTime(idTv: number, time: string);
}
