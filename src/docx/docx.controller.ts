import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as mammoth from 'mammoth';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import { DocxService } from './docx.service';

@Controller('docx')
export class DocxController {
  constructor(private readonly docxToPdfService: DocxService) {}

  @Post('convert-docx-to-html')
  @UseInterceptors(
    FileInterceptor('docx', {
      storage: diskStorage({
        destination: '../pm_qlgn/public/uploads',
        filename: (req, file, callback) => {
          const randomName = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 8).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFileImage(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    const { value } = await mammoth.convertToHtml(
      { path: file.path },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1.my-custom-heading",
          "p[style-name='Heading 2'] => h2.my-custom-subheading",
          // Ánh xạ các lược đồ khác tùy thuộc vào nhu cầu của bạn
        ],
      },
    );

    return value;
  }

  // @Post('convert')
  // @UseInterceptors(
  //   FileInterceptor('docxFile', {
  //     storage: diskStorage({
  //       destination: '../pm_qlgn/public/uploads/pdf',
  //       filename: (req, file, callback) => {
  //         const randomName = Array(8)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 8).toString(16))
  //           .join('');
  //         return callback(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // async convertDocxToPdf(@UploadedFile() docxFile: Express.Multer.File) {
  //   const docxFilePath = docxFile.path; // Đường dẫn tới tệp .docx
  //   const pdfFilePath = `../pm_qlgn/public/uploads/pdf/${docxFile.filename}.pdf`; // Đường dẫn tới tệp .pdf đầu ra

  //   await this.docxToPdfService.convertDocxToPdf(docxFilePath, pdfFilePath);

  //   return { message: 'Chuyển đổi thành công' };
  // }
}
