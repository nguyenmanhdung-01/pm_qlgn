import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateDSHGDHLDetails } from '../utils/types';
import { BangThongTinHoHL } from 'src/utils/typeorm/entities/BangThongTinHoGiaDinhHL';
import { IHGDHLService } from './dshgdhl';
import * as _ from 'lodash';
import { Services } from 'src/utils/constants';
import { IXaService } from 'src/xa/xa';
import * as XlsxTemplate from 'xlsx-template';
import * as fs from 'fs';
import * as path from 'path';

// import * as XlsxModule from 'docxtemplater-xlsx-module';
// import { IRoleService } from 'src/role/role';

@Injectable()
export class DSHGDHLService implements IHGDHLService {
  constructor(
    @InjectRepository(BangThongTinHoHL)
    private readonly tthhlRepository: Repository<BangThongTinHoHL>,

    @Inject(Services.XA) private xaService: IXaService,
  ) {}

  async create(
    DonViID: number,
    KhuVucRaSoatID: number,
    dotRaSoatID: number,
    createDetails: CreateDSHGDHLDetails[],
  ) {
    const allRow = await this.getAll();

    const dataDelete = allRow?.filter(
      (x) =>
        +x?.DotRaSoatID === +dotRaSoatID &&
        x.IsRemoved !== true &&
        +x?.KhuVucRaSoatID === KhuVucRaSoatID &&
        +x?.DonViID === DonViID,
    );

    const idDelete = dataDelete?.map((item) => {
      return item?.RowID;
    });

    if (idDelete?.length !== 0) {
      this.tthhlRepository.delete(idDelete);
      const saved = await this.tthhlRepository.save(createDetails);
      return saved;
    } else {
      const saved = await this.tthhlRepository.save(createDetails);
      return saved;
    }
  }
  async getAll(): Promise<BangThongTinHoHL[]> {
    const results = await this.tthhlRepository.find();
    const filteredResults = results.filter((result) => !result.IsRemoved); // Lọc ra những mục không bị xóa
    return filteredResults;
  }

  async getByDRS(dotRaSoatID: number): Promise<any> {
    // get so ho ngheo theo kvrs
    const resultsSoHo = await this.tthhlRepository
      .createQueryBuilder('tthhl')
      .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
      .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('tthhl.HoVaTenChuHo IS NOT NUll')
      .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 1 })
      .orderBy('tthhl.RowID', 'ASC')
      .getMany();

    const groupedResultsSoHo = _.groupBy(resultsSoHo, 'KhuVucRaSoatID');
    const countByGroupSoHo = _.mapValues(groupedResultsSoHo, 'length');

    // get so nhan khau ngheo theo kvrs
    const resultsSoNhanKhau = await this.tthhlRepository
      .createQueryBuilder('tthhl')
      .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
      .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 1 })
      .orderBy('tthhl.RowID', 'ASC')
      .getMany();

    const groupedResultsSoNhanKhau = _.groupBy(
      resultsSoNhanKhau,
      'KhuVucRaSoatID',
    );
    const countByGroupNhanKhau = _.mapValues(
      groupedResultsSoNhanKhau,
      'length',
    );

    // get so nhan khau can ngheo theo kvrs
    const resultsSoNhanKhauCanNgheo = await this.tthhlRepository
      .createQueryBuilder('tthhl')
      .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
      .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 2 })
      .orderBy('tthhl.RowID', 'ASC')
      .getMany();

    const groupedResultsSoNhanKhauCanNgheo = _.groupBy(
      resultsSoNhanKhauCanNgheo,
      'KhuVucRaSoatID',
    );
    const countByGroupNhanKhauCanNgheo = _.mapValues(
      groupedResultsSoNhanKhauCanNgheo,
      'length',
    );

    // get so ho can ngheo theo kvrs
    const resultsSoHoCanNgheo = await this.tthhlRepository
      .createQueryBuilder('tthhl')
      .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
      .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
      .andWhere('tthhl.HoVaTenChuHo IS NOT NUll')
      .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 2 })
      .orderBy('tthhl.RowID', 'ASC')
      .getMany();

    const groupedResultsSoHoCanNgheo = _.groupBy(
      resultsSoHoCanNgheo,
      'KhuVucRaSoatID',
    );
    const countByGroupHoCanNgheo = _.mapValues(
      groupedResultsSoHoCanNgheo,
      'length',
    );

    // get so ho ngheo theo xa
    const getAllXa = await this.xaService.findChildrenByIdParent(16);

    const sohotheoxa = getAllXa.map(async (item) => {
      const resultsDetailXa = await this.tthhlRepository
        .createQueryBuilder('tthhl')
        .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
        .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
        .andWhere('tthhl.HoVaTenChuHo IS NOT NUll')
        .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 1 })
        .andWhere('tthhl.Xa = :Xa', { Xa: item?.TenXa })
        .orderBy('tthhl.RowID', 'ASC')
        .getMany();

      const resultsSoHoNgheoTheoXa = await this.tthhlRepository
        .createQueryBuilder('tthhl')
        .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
        .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
        .andWhere('tthhl.HoVaTenChuHo IS NOT NUll')
        .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 1 })
        .andWhere('tthhl.Xa = :Xa', { Xa: item?.TenXa })
        .orderBy('tthhl.RowID', 'ASC')
        .getCount();
      const resultsSoKhauNgheoTheoXa = await this.tthhlRepository
        .createQueryBuilder('tthhl')
        .where('tthhl.DotRaSoatID = :DotRaSoatID', { DotRaSoatID: dotRaSoatID })
        .andWhere('tthhl.IsRemoved = :IsRemoved', { IsRemoved: false })
        .andWhere('tthhl.PhanLoaiHo = :PhanLoaiHo', { PhanLoaiHo: 1 })
        .andWhere('tthhl.Xa = :Xa', { Xa: item?.TenXa })
        .orderBy('tthhl.RowID', 'ASC')
        .getCount();

      const uniqueResults = _.uniqBy(resultsDetailXa, 'Xa');

      return {
        mauXa: uniqueResults,
        countHoNgheo: resultsSoHoNgheoTheoXa,
        countKhauNgheo: resultsSoKhauNgheoTheoXa,
      };
    });
    const sohotheoxaResults = await Promise.all(sohotheoxa);

    return {
      countToltal: {
        ho_ngheo: countByGroupSoHo,
        khau_ngheo: countByGroupNhanKhau,
        khau_can_ngheo: countByGroupNhanKhauCanNgheo,
        ho_can_ngheo: countByGroupHoCanNgheo,
      },
      ho_ngheo_xa: sohotheoxaResults,
    };
  }

  async exportDanhSach09(data: any): Promise<any> {
    // console.log('data: ', data);
    const dataFileterXa = data?.ho_ngheo_xa.filter(
      (x: any) => x.mauXa?.length !== 0,
    );
    const dataXa = dataFileterXa?.map((item: any, index) => {
      return {
        ...item,
        kvrsID: item?.mauXa[0]?.KhuVucRaSoatID,
      };
    });
    const dataXaTT = dataXa.filter((x: any) => x.kvrsID === 6);
    const dataxaTTIndex = dataXaTT?.map((item: any, index) => {
      // console.log('item: ', item.mauXa[0].Xa);

      return {
        ...item,
        stt: index + 1,
        ten: item.mauXa[0].Xa,
        ho: 'Hộ',
      };
    });

    console.log('dataxaTTIndex: ', dataxaTTIndex);
    const newArray = [];
    for (const item of dataxaTTIndex) {
      newArray.push(item);
      newArray.push({
        ten: '-',
        stt: '-',
        countHoNgheo: item.countKhauNgheo,
        ho: 'Nhân Khẩu',
      });
    }
    console.log('newArray: ', newArray);

    const dataXaNT = dataXa.filter((x: any) => x.kvrsID === 4);
    // console.log('dataXaNT: ', dataXaNT);
    // console.log('dataXa: ', dataXa);

    const dataxaNTIndex = dataXaNT?.map((item: any, index) => {
      return {
        ...item,
        stt: index + 1,
      };
    });
    const groupedData = {};
    for (const key in data?.countToltal) {
      if (data?.countToltal.hasOwnProperty(key)) {
        const subData = data?.countToltal[key];
        for (const subKey in subData) {
          if (subData.hasOwnProperty(subKey)) {
            groupedData[subKey] = groupedData[subKey] || [];
            groupedData[subKey].push({ [key]: subData[subKey] });
          }
        }
      }
    }
    const values = {
      text: 2,
      kvnt: dataxaNTIndex,
      kvtt: dataxaTTIndex,
      kvttv1: newArray,
      ho_ngheo: groupedData['1'][0].ho_ngheo,
      khau_ngheo: groupedData['1'][1].khau_ngheo,
      khau_can_ngheo: groupedData['1'][2].khau_can_ngheo,
      ho_can_ngheo: groupedData['1'][3].ho_can_ngheo,
      ho_ngheo_nt: groupedData['2'][0].ho_ngheo,
      khau_ngheo_nt: groupedData['2'][1].khau_ngheo,
      khau_can_ngheo_nt: groupedData['2'][2].khau_can_ngheo,
      ho_can_ngheo_nt: groupedData['2'][3].ho_can_ngheo,
    };
    const templateData = path.join(
      __dirname,
      '../../public/uploads',
      'Mau_09.xlsx',
    );
    console.log('values', values);
    const content = fs.readFileSync(templateData);
    const template = new XlsxTemplate(content);
    const sheetNumber = 1;
    template.substitute(sheetNumber, values);
    const outputData = template.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    const outputFilePath = 'output.xlsx';
    fs.writeFileSync(outputFilePath, outputData, 'binary');
    const fileContent = fs.readFileSync(outputFilePath);
    return fileContent;
  }
}
