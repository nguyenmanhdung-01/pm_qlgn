import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BangChiSoThieuHutDVXHCB, BangKhuVucRaSoat } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import * as exceljs from 'exceljs';
import * as XlsxTemplate from 'xlsx-template';
import * as fs from 'fs';
import * as path from 'path';
import { createChiSoDto } from './dtos/createChiSoDto.dto';
@Injectable()
export class ChiSoThieuHutService {
  constructor(
    @InjectRepository(BangChiSoThieuHutDVXHCB)
    private readonly chiSoThieuHutRepository: Repository<BangChiSoThieuHutDVXHCB>,
    @InjectRepository(BangKhuVucRaSoat)
    private readonly khuVucRaSoatRepository: Repository<BangKhuVucRaSoat>,
  ) {}

  async getChiSoByID(
    PhanLoaiHoID: number,
    TinhID: number,
    HuyenID: number,
    thoiDiemKetXuat: number,
  ) {
    // console.log('huyenID', HuyenID);

    const chiSo = await this.chiSoThieuHutRepository
      .createQueryBuilder('chiSo')
      .where('chiSo.IsRemoved = :IsRemoved', { IsRemoved: 0 })
      //   .leftJoinAndSelect('chiSo.PhanLoaiHoID', 'PhanLoaiHo')
      .andWhere('chiSo.PhanLoaiHoID = :PhanLoaiHoID', { PhanLoaiHoID })
      .andWhere('chiSo.TinhID = :TinhID', { TinhID })
      .andWhere('chiSo.HuyenID = :HuyenID', { HuyenID })
      // .andWhere('chiSo.thoiDiemKetXuat = :thoiDiemKetXuat', { thoiDiemKetXuat })
      .leftJoinAndSelect('chiSo.KhuVucRaSoatID', 'KhuVucRaSoatID')
      .leftJoinAndSelect('chiSo.TinhID', 'TinhID')
      .leftJoinAndSelect('chiSo.HuyenID', 'HuyenID')
      .leftJoinAndSelect('chiSo.XaID', 'XaID')
      .leftJoinAndSelect('chiSo.PhanLoaiHoID', 'PhanLoaiHoID')
      .getMany();
    // console.log('chiSo created', chiSo);

    const totalTongSoHo = chiSo.reduce((acc, chiSo) => acc + chiSo.tongSoHo, 0);
    const totalIndex = {};

    for (let i = 1; i <= 12; i++) {
      totalIndex[`index${i}`] = chiSo.reduce(
        (acc, chiSo) => acc + chiSo[`index${i}`],
        0,
      );
    }

    return { data: chiSo, totalTongSoHo, totalIndex };
  }

  async getThoiDiemKetXuat() {
    const thoidiem = await this.chiSoThieuHutRepository
      .createQueryBuilder('chiSoThieuHut')
      .select('DISTINCT(chiSoThieuHut.thoiDiemKetXuat)')
      .getRawMany();

    return thoidiem.map((item) => item.thoiDiemKetXuat);
  }

  async processExcelFile(file: any, khuVuc: createChiSoDto) {
    // console.log('khuVuc', khuVuc);

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues();

    let totalUrban = 0; // Tổng khu vực thành thị
    let totalRural = 0; // Tổng khu vực nông thôn
    let isUrban = true; // Biến theo dõi khu vực hiện tại, ban đầu là khu vực thành thị
    const totalColumnsUrban = Array(12).fill(0);
    const totalColumnsRural = Array(12).fill(0);
    const khuVucInfo = [];
    for (let i = 8; i < rows.length; i++) {
      const row = rows[i];
      if (row.length) {
        const khuVuc = row[2];
        const ts = row[3];
        // console.log('row2', row[2]);

        if (
          (typeof khuVuc === 'string' &&
            khuVuc.trim().toLowerCase() === 'khu vực thành thị') ||
          (typeof khuVuc === 'string' &&
            khuVuc.trim().toLowerCase() === 'khu vực nông thôn')
        ) {
          const getKhuVuc = await this.khuVucRaSoatRepository.findOne({
            TenKhuVuc: khuVuc.trim().toLowerCase(),
          });
          khuVucInfo.push(getKhuVuc);
        }

        // Kiểm tra xem khu vực hiện tại có phải là khu vực thành thị không
        if (
          typeof khuVuc === 'string' &&
          khuVuc.trim().toLowerCase() === 'khu vực thành thị'
        ) {
          isUrban = true;
        } else if (
          typeof khuVuc === 'string' &&
          khuVuc.trim().toLowerCase() === 'khu vực nông thôn'
        ) {
          isUrban = false;
        }

        if (!isNaN(ts)) {
          if (isUrban) {
            totalUrban += ts; // Nếu là khu vực thành thị, cộng vào tổng thành thị
            for (let j = 4; j < 16; j++) {
              const value = parseFloat(row[j]) || 0;
              totalColumnsUrban[j - 4] += value;
            }
          } else {
            // Nếu không phải là khu vực thành thị, cộng vào tổng nông thôn
            if (khuVuc !== 'Tổng cộng I + II') {
              totalRural += ts;
              for (let j = 4; j < 16; j++) {
                const value = parseFloat(row[j]) || 0;
                totalColumnsRural[j - 4] += value;
              }
            }
          }
        }
      }
    }
    // console.log('Tổng từ cột 1 đến 12:', totalColumns[0]);
    // console.log('Khu vực thông tin:', khuVucInfo);

    // console.log('Tổng khu vực thành thị:', totalUrban);
    // console.log('Tổng khu vực nông thôn:', totalRural);
    const urbanRecord = new BangChiSoThieuHutDVXHCB();
    urbanRecord.thoiDiemNhap = new Date(); // Đặt thời điểm kết xuất là thời điểm hiện tại
    urbanRecord.PhanLoaiHoID =
      khuVuc.PhanLoaiHoID; /* Gán PhanLoaiHoID tương ứng */
    urbanRecord.dataType = '%'; // Đặt kiểu dữ liệu tùy theo nhu cầu
    urbanRecord.KhuVucRaSoatID = khuVucInfo.find(
      (item) =>
        typeof item.TenKhuVuc === 'string' &&
        item.TenKhuVuc.trim().toLowerCase() === 'khu vực thành thị',
    ).KhuVucRaSoatID;
    urbanRecord.tongSoHo = totalUrban;
    urbanRecord.index1 = totalColumnsUrban[0];
    urbanRecord.index2 = totalColumnsUrban[1];
    urbanRecord.index3 = totalColumnsUrban[2];
    urbanRecord.index4 = totalColumnsUrban[3];
    urbanRecord.index5 = totalColumnsUrban[4];
    urbanRecord.index6 = totalColumnsUrban[5];
    urbanRecord.index7 = totalColumnsUrban[6];
    urbanRecord.index8 = totalColumnsUrban[7];
    urbanRecord.index9 = totalColumnsUrban[8];
    urbanRecord.index10 = totalColumnsUrban[9];
    urbanRecord.index11 = totalColumnsUrban[10];
    urbanRecord.index12 = totalColumnsUrban[11];
    urbanRecord.VungID = khuVuc.VungID;
    urbanRecord.TinhID = khuVuc.TinhID;
    urbanRecord.HuyenID = khuVuc.HuyenID;
    urbanRecord.XaID = khuVuc.XaID;

    await this.chiSoThieuHutRepository.save(urbanRecord); // Lưu bản ghi khu vực thành thị vào cơ sở dữ liệu

    // Tạo và lưu bản ghi cho khu vực nông thôn
    const ruralRecord = new BangChiSoThieuHutDVXHCB();
    ruralRecord.thoiDiemNhap = new Date(); // Đặt thời điểm kết xuất là thời điểm hiện tại
    ruralRecord.PhanLoaiHoID =
      khuVuc.PhanLoaiHoID /* Gán PhanLoaiHoID tương ứng */;
    ruralRecord.dataType = '%'; // Đặt kiểu dữ liệu tùy theo nhu cầu
    ruralRecord.KhuVucRaSoatID = khuVucInfo.find(
      (item) =>
        typeof item.TenKhuVuc === 'string' &&
        item.TenKhuVuc.trim().toLowerCase() === 'khu vực nông thôn',
    ).KhuVucRaSoatID;
    ruralRecord.tongSoHo = totalRural;
    ruralRecord.index1 = totalColumnsRural[0];
    ruralRecord.index2 = totalColumnsRural[1];
    ruralRecord.index3 = totalColumnsRural[2];
    ruralRecord.index4 = totalColumnsRural[3];
    ruralRecord.index5 = totalColumnsRural[4];
    ruralRecord.index6 = totalColumnsRural[5];
    ruralRecord.index7 = totalColumnsRural[6];
    ruralRecord.index8 = totalColumnsRural[7];
    ruralRecord.index9 = totalColumnsRural[8];
    ruralRecord.index10 = totalColumnsRural[9];
    ruralRecord.index11 = totalColumnsRural[10];
    ruralRecord.index12 = totalColumnsRural[11];
    ruralRecord.VungID = khuVuc.VungID;
    ruralRecord.TinhID = khuVuc.TinhID;
    ruralRecord.HuyenID = khuVuc.HuyenID;
    ruralRecord.XaID = khuVuc.XaID;

    await this.chiSoThieuHutRepository.save(ruralRecord);

    return { totalUrban, totalRural }; // Nếu bạn muốn trả về cả hai tổng
  }

  async generateExcelFile(data: any) {
    const values = {
      data1: data.dataPhanTich.data1,
      data2: data.dataPhanTich.data2,
      dataTong: data.dataPhanTich.dataTong,
      count: data.dataPhanTich.count,
      index1: data.dataPhanTich.index1,
      index2: data.dataPhanTich.index2,
      index3: data.dataPhanTich.index3,
      index4: data.dataPhanTich.index4,
      index5: data.dataPhanTich.index5,
      index6: data.dataPhanTich.index6,
      index7: data.dataPhanTich.index7,
      index8: data.dataPhanTich.index8,
      index9: data.dataPhanTich.index9,
      index10: data.dataPhanTich.index10,
      index11: data.dataPhanTich.index11,
      index12: data.dataPhanTich.index12,
      loaiHo: data.loaiHo,
    };

    const valuesTyLe = {
      data1: data.dataTyLe.data1,
      data2: data.dataTyLe.data2,
      dataTong: data.dataTyLe.dataTong,
      count: data.dataTyLe.count,
      index1: data.dataTyLe.index1,
      index2: data.dataTyLe.index2,
      index3: data.dataTyLe.index3,
      index4: data.dataTyLe.index4,
      index5: data.dataTyLe.index5,
      index6: data.dataTyLe.index6,
      index7: data.dataTyLe.index7,
      index8: data.dataTyLe.index8,
      index9: data.dataTyLe.index9,
      index10: data.dataTyLe.index10,
      index11: data.dataTyLe.index11,
      index12: data.dataTyLe.index12,
      loaiHo: data.loaiHo,
    };

    for (let i = 0; i < data.RowID.length; i++) {
      const rowId = data.RowID[i];
      // console.log('Row ID', rowId);
      await this.chiSoThieuHutRepository.update(
        { RowID: rowId },
        { thoiDiemKetXuat: new Date() },
      );
    }

    const templatePath = path.resolve(__dirname, '../../public/file/CSTH.xlsx');

    const template = new XlsxTemplate(fs.readFileSync(templatePath));

    // Điền dữ liệu vào tệp Excel
    template.substitute(1, values);
    template.substitute(2, valuesTyLe);
    const outputData = template.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const outputFilePath = 'output.xlsx';
    fs.writeFileSync(outputFilePath, outputData, 'binary');
    const fileContent = fs.readFileSync(outputFilePath);

    // const urbanRecord = new BangChiSoThieuHutDVXHCB();
    // urbanRecord.thoiDiemKetXuat = new Date();
    // await this.chiSoThieuHutRepository.save(urbanRecord);

    return fileContent;
  }
}
