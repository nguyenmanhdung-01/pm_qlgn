import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';

import { IUpLoadFileService } from './upload';

import * as xlsx from 'xlsx';
import * as forge from 'node-forge';
import * as _ from 'lodash';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class UpLoadFileService implements IUpLoadFileService {
  async uploadDanhSach(file: any): Promise<any> {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    try {
      const workbook = xlsx?.read(file.buffer, { type: 'buffer' });
      const sheetName0 = workbook?.SheetNames[0];
      const sheetName1 = workbook?.SheetNames[1];
      const sheetName2 = workbook?.SheetNames[2];
      const worksheet0 = workbook?.Sheets[sheetName0];
      const worksheet1 = workbook?.Sheets[sheetName1];
      const worksheet2 = workbook?.Sheets[sheetName2];

      // if (
      //   worksheet0['A4']?.v !==
      //     'DANH SÁCH HỘ NGHÈO, HỘ CẬN NGHÈO SAU KHI RÀ SOÁT' &&
      //   worksheet1['B5']?.v !== 'DANH SÁCH HỘ THOÁT NGHÈO SAU KHI RÀ SOÁT' &&
      //   worksheet2['B5']?.v !== 'DANH SÁCH HỘ THOÁT CẬN NGHÈO SAU KHI RÀ SOÁT'
      // ) {
      //   throw new HttpException(
      //     'Vui lòng chọn đúng file !',
      //     HttpStatus.CONFLICT,
      //   );
      // }

      //bang2

      const rangeB2 = 'A10:P1000'; // Đổi phạm vi bảng cần đọc (ví dụ: từ A2 đến C10)
      const dataB2 = xlsx.utils.sheet_to_json(worksheet1, {
        range: rangeB2,
        header: 'A',
      });
      const resultB2 = dataB2.map((row) => {
        if (!row['E'] && !row['F'] && !row['G']) {
          return;
        } else {
          return {
            HoVaTenChuHo: row['B'] ? row['C'] : null,
            QHVCH: row['D'],
            GioiTinh: row['E'],
            NgaySinh: new Date(this?.convertDateFormat(row['F'])) || null,
            CCCD: row['G'],
            //
            HoVaTenThanhVien: !row['B'] ? row['C'] : null,
            Tinh: null,
            Huyen: null,
            MaHuyen: null,
            Xa: null,
            MaXa: null,
            Thon: null,
            PhanLoaiHo: null,
            QDCN: null,
            NgayBanHanhQD: null,
            isDTTS: null,
            isKNLD: null,
            isTVCCCM: null,
            NguyenNhanNgheo: null,
            //
            isThoatNgheo: true,
            DanToc: row['H'],
            DiaChi: row['I'],
            B1: row['J'],
            B2: row['K'],
            GhiChu: row['M'],
            Tuoi: row['O'],
            SoNhanKhau: row['P'],
            isChildren: +row['O'] < 16 ? true : false,
            ChuHoID:
              row['B'] &&
              this.hashChuHoID(
                row['C'] + row['E'] + row['F'] + row['G'] + row['H'],
              ),
          };
        }
      });
      const dataB2Format = resultB2.filter(
        (x) => x !== null && x !== undefined,
      );
      const dataAddChuHoIDB2 = this.addMissingChuHoID(dataB2Format);
      //bang3
      const rangeB3 = 'A10:P1000'; // Đổi phạm vi bảng cần đọc (ví dụ: từ A2 đến C10)
      const dataB3 = xlsx.utils.sheet_to_json(worksheet2, {
        range: rangeB3,
        header: 'A',
      });
      const resultB3 = dataB3.map((row) => {
        if (!row['E'] && !row['F'] && !row['G']) {
          return;
        } else {
          return {
            HoVaTenChuHo: row['B'] ? row['C'] : null,
            QHVCH: row['D'],
            ChuHoID:
              row['B'] &&
              this.hashChuHoID(
                row['C'] + row['E'] + row['F'] + row['G'] + row['H'],
              ),
            GioiTinh: row['E'],
            NgaySinh: new Date(this?.convertDateFormat(row['F'])) || null,
            CCCD: row['G'],
            //
            HoVaTenThanhVien: !row['B'] ? row['C'] : null,
            Tinh: null,
            Huyen: null,
            MaHuyen: null,
            Xa: null,
            MaXa: null,
            Thon: null,
            PhanLoaiHo: null,
            QDCN: null,
            NgayBanHanhQD: null,
            isDTTS: null,
            isKNLD: null,
            isTVCCCM: null,
            NguyenNhanNgheo: null,
            //

            isThoatCanNgheo: true,
            DanToc: row['H'],
            DiaChi: row['I'],
            B1: row['J'],
            B2: row['K'],
            GhiChu: row['M'],
            Tuoi: row['O'],
            SoNhanKhau: row['P'],
            isChildren: +row['O'] < 16 ? true : false,

            // ty_le_ho_ngheo: (row['F'] * 100).toFixed(2) + '%',
          };
        }
      });

      const dataB3Format = resultB3.filter(
        (x) => x !== null && x !== undefined,
      );
      const dataAddChuHoIDB3 = this.addMissingChuHoID(dataB3Format);

      //bang1
      const rangeB1 = 'A8:AA1000'; // Đổi phạm vi bảng cần đọc (ví dụ: từ A2 đến C10)
      const dataB1 = xlsx.utils.sheet_to_json(worksheet0, {
        range: rangeB1,
        header: 'A',
      });
      const resultB1 = dataB1.map((row) => {
        if (!row['E'] && !row['F'] && !row['G']) {
          return;
        } else {
          return {
            HoVaTenChuHo: row['C'],
            HoVaTenThanhVien: row['D'],
            ChuHoID:
              row['B'] &&
              this.hashChuHoID(
                row['C'] + row['F'] + row['G'] + row['H'] + row['O'],
              ),
            QHVCH: row['E'],
            NgaySinh: row['F'],
            GioiTinh: row['G'],
            CCCD: row['H'],
            Tinh: row['I'],
            Huyen: row['J'],
            MaHuyen: row['K'],
            Xa: row['L'],
            MaXa: row['M'],
            Thon: row['N'],
            DanToc: row['O'],
            PhanLoaiHo: row['P'],
            QDCN: row['Q'],
            NgayBanHanhQD: row['R'],
            B1: row['S'],
            B2: row['T'],
            isDTTS: row['U'],
            isKNLD: row['V'],
            isTVCCCM: row['W'],
            NguyenNhanNgheo: row['X'],
            Tuoi: row['Z'],
            SoNhanKhau: row['AA'],
            isChildren: +row['Z'] < 16 ? true : false,
          };
        }
      });
      const dataB1Format = resultB1.filter(
        (x) => x !== null && x !== undefined,
      );
      const dataAddChuHoIDB1 = this.addMissingChuHoID(dataB1Format);
      const dataAddChuHoIDB1Lan2 = dataAddChuHoIDB1.map((row) => {
        return {
          HoVaTenChuHo: row['HoVaTenChuHo'],
          HoVaTenThanhVien: row['HoVaTenThanhVien'],
          ChuHoID: row['ChuHoID'],
          QHVCH: row['QHVCH'],
          NgaySinh: new Date(this?.convertDateFormat(row['NgaySinh'])) || null,
          GioiTinh: row['GioiTinh'],
          CCCD: row['CCCD'],
          Tinh: row['Tinh'],
          Huyen: row['Huyen'],
          MaHuyen: row['MaHuyen'],
          Xa: row['Xa'],
          MaXa: row['MaXa'],
          Thon: row['Thon'],
          DanToc: row['DanToc'],
          PhanLoaiHo: row['PhanLoaiHo'],
          QDCN: row['QDCN'],
          NgayBanHanhQD:
            new Date(this?.convertDateFormat(row['NgayBanHanhQD'])) || null,
          B1: row['B1'],
          B2: row['B2'],
          isDTTS: row['isDTTS'],
          isKNLD: row['isKNLD'],
          isTVCCCM: row['isTVCCCM'],
          NguyenNhanNgheo: row['NguyenNhanNgheo'],
          Tuoi: row['Tuoi'],
          SoNhanKhau: row['SoNhanKhau'],
          isChildren: row['isChildren'],
          DiaChi:
            dataAddChuHoIDB2.find((x) => x.ChuHoID === row['ChuHoID'])
              ?.DiaChi || null,

          GhiChu:
            dataAddChuHoIDB2.find((x) => x?.ChuHoID === row['ChuHoID'])
              ?.GhiChu || null,
          isThoatNgheo:
            dataAddChuHoIDB2.find((x) => x?.ChuHoID === row['ChuHoID'])
              ?.isThoatNgheo || false,
          isThoatCanNgheo:
            dataAddChuHoIDB3.find((x) => x?.ChuHoID === row['ChuHoID'])
              ?.isThoatCanNgheo || false,
        };
      });

      // Duyệt qua mảng dữ liệu và cập nhật dia_ban nếu cần
      const mergeData = dataAddChuHoIDB1Lan2
        .concat(dataAddChuHoIDB2)
        .concat(dataAddChuHoIDB3);
      const data = this.filteredData(mergeData);

      return data;
    } catch (error) {
      throw new HttpException('Không đọc được file !', HttpStatus.CONFLICT);
    }
  }
  hashChuHoID(inputString: string): number {
    const md = forge.md.md5.create();
    md.update(inputString, 'utf8');
    const hashBytes = md.digest().bytes();
    const integerHash = Buffer.from(hashBytes).readUInt32BE(0);

    return integerHash;
  }

  filteredData(data: any[]) {
    const uniqueData = _.uniqWith(
      data,
      (a, b) =>
        a.CCCD === b.CCCD &&
        a.ChuHoID === b.ChuHoID &&
        a.NgaySinh === b.NgaySinh,
    );
    return uniqueData;
  }

  addMissingChuHoID(data: any[]) {
    let currentChuHoID = null;
    let currentPhanLoaiHo = null;

    return data.map((item) => {
      if (item.ChuHoID) {
        currentChuHoID = item.ChuHoID;
      } else {
        item.ChuHoID = currentChuHoID;
      }
      if (item.PhanLoaiHo) {
        currentPhanLoaiHo = item.PhanLoaiHo;
      } else {
        item.PhanLoaiHo = currentPhanLoaiHo;
      }
      return item;
    });
  }

  convertDateFormat(inputDate: any) {
    console.log('inputDate', inputDate);

    // Tách ngày, tháng và năm từ chuỗi
    const parts = inputDate.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    // Định dạng lại ngày tháng theo định dạng "yyyy-MM-dd"
    const outputDate = `${year}-${month}-${day}`;

    return outputDate;
  }
}
