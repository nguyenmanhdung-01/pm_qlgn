import { Controller } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IQuanLyTaiLieu } from './ql_tai-lieu';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Delete,
  Get,
  Put,
  Inject,
  Param,
  Post,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { CreateTaiLieuDto } from './dtos/CreateDocument.dto';
import { BangDanhSachTaiLieu } from 'src/utils/typeorm';
import { UpdateTaiLieuDto } from './dtos/UpdateDocument.dto';
@Controller(Routes.QUANLYTAILIEU)
export class QlTaiLieuController {
  constructor(
    @Inject(Services.QUANLYTAILIEU)
    private readonly quanlyTaiLieuService: IQuanLyTaiLieu,
  ) {}

  @Get('/allTaiLieu')
  async getAllTaiLieu(): Promise<BangDanhSachTaiLieu[]> {
    return this.quanlyTaiLieuService.getAllTaiLieu();
  }

  @Get('/:idHoGiaDinh/TaiLieuHoGD')
  async getAllTaiLieuHoGD(
    @Param('idHoGiaDinh') idHoGiaDinh: number,
  ): Promise<BangDanhSachTaiLieu[]> {
    return this.quanlyTaiLieuService.getAllTaiLieuHoGD(idHoGiaDinh);
  }

  @Get('/allDocuments')
  async getAllDocument(@Query() queryParams: any) {
    console.log('query', queryParams);

    return this.quanlyTaiLieuService.getAllDocument(queryParams);
  }

  @Get('/allDocumentKetXuat')
  async getAllDocumentKetXuat(@Query() queryParams: any) {
    console.log('query', queryParams);

    return this.quanlyTaiLieuService.getAllDocumentKetXuat(queryParams);
  }

  // @UseInterceptors(
  //   FilesInterceptor('file', null, {
  //     storage: diskStorage({
  //       destination: '../pm_qlgn/public/uploads', // Đường dẫn thư mục lưu trữ file
  //       filename: (req, file, callback) => {
  //         const randomName = Date.now();
  //         const originalName = Buffer.from(
  //           file.originalname,
  //           'latin1',
  //         ).toString('utf8');
  //         console.log('originalName: ', file);
  //         const fileName = randomName + '-' + originalName;
  //         callback(null, fileName); // Tên file được lưu
  //       },
  //     }),
  //     limits: {
  //       fileSize: 100 * 1024 * 1024,
  //       fieldSize: 100 * 1024 * 1024,
  //     },
  //   }),
  // )
  @Post('/uploadDocuments')
  async uploadFile(@Body() tailieuDto: CreateTaiLieuDto): Promise<any> {
    console.log('tailieuDto', tailieuDto);

    const { userId, LoaiTaiLieuID, DonViID, HoGiaDinhID, ...postData } =
      tailieuDto;
    // console.log('LoaiTaiLieuID', LoaiTaiLieuID);

    return this.quanlyTaiLieuService.createTaiLieu(
      userId,
      LoaiTaiLieuID,
      DonViID,
      postData,
      HoGiaDinhID,
    );
  }

  @Post('deletes')
  async deleteMultiple(@Body() ids: number[]) {
    //console.log(ids);

    return await this.quanlyTaiLieuService.deleteMultiple(ids);
  }

  @Put(':id/deleteTaiLieu')
  async markAsRemoved(@Param('id') truongThongTinID: number) {
    // Gọi service để cập nhật trường IsRemoved thành true
    const updated = await this.quanlyTaiLieuService.deleteTruongThongTinHo(
      truongThongTinID,
    );

    if (!updated) {
      throw new NotFoundException(
        `Không tìm thấy trường thông tin với ID ${truongThongTinID}`,
      );
    }

    return { message: 'Đã cập nhật trạng thái thành công' };
  }

  @Put('/updateTaiLieu/:id')
  async updateTaiLieu(
    @Param('id') id: number,
    @Body() updateTaiLieuDto: UpdateTaiLieuDto,
  ): Promise<BangDanhSachTaiLieu> {
    // console.log('file', file);

    // Xử lý cập nhật thông tin tài liệu ở đây (sử dụng updateTaiLieuDto

    // Xử lý tệp tải lên và lưu trữ nó (nếu có)
    const { NguoiChinhSuaID, ...formData } = updateTaiLieuDto;
    // Cập nhật thông tin tài liệu (sử dụng updateTaiLieuDto)
    const updatedTaiLieu = await this.quanlyTaiLieuService.updateTaiLieu(
      id,
      NguoiChinhSuaID,
      formData,
    );
    return updatedTaiLieu;
  }

  @Get('getTaiLieu/:id')
  async getTaiLieu(@Param('id') id: number): Promise<BangDanhSachTaiLieu> {
    return await this.quanlyTaiLieuService.getTaiLieu(id);
  }
}
