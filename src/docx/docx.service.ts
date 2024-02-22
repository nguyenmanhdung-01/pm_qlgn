// src/docx/docx.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as docx from 'html-docx-js';
import * as mammoth from 'mammoth';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'; // Import fontkit
// Đăng ký fontkit với PDFDocument
@Injectable()
export class DocxService {
  createDocxFromHtml(htmlContent: string): Buffer {
    const docxBuffer = docx.asBlob(htmlContent);
    return docxBuffer as any;
  }

  // async convertDocxToPdf(
  //   docxFilePath: string,
  //   pdfFilePath: string,
  // ): Promise<void> {
  //   const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch font');
  //     }

  //     const fontBytes = await response.arrayBuffer();

  //     // Tiếp tục xử lý và tạo tệp PDF tại đây
  //     // ...
  //   } catch (error) {
  //     console.error('Error fetching font:', error);
  //   }
  //   // Đọc tệp .docx và lấy nội dung
  //   const { value } = await mammoth.convertToHtml({ path: docxFilePath });
  //   const htmlContent = value;
  //   const fontFilePath = '../pm_qlgn/public/uploads/pdf/NotoSans-Light.ttf';
  //   // Tạo một tài liệu PDF mới
  //   const pdfDoc = await PDFDocument.create();
  //   pdfDoc.registerFontkit(fontkit);

  //   // const fontBytes = fs.readFileSync(fontFilePath);
  //   const customFont = await pdfDoc.embedFont(fontBytes);

  //   const page = pdfDoc.addPage([612, 792]); // Kích thước trang US Letter
  //   const { width, height } = page.getSize();
  //   const fontSize = 30;
  //   // Vẽ nội dung HTML lên xObject form
  //   page.setFont(customFont);
  //   page.drawText(htmlContent, {
  //     x: 50,
  //     y: height - 4 * fontSize,
  //     size: 12,
  //     color: rgb(0, 0, 0), // Màu chữ đen
  //   });

  //   // Chuyển đổi trang PDF thành dạng byte và ghi vào tệp PDF
  //   const pdfBytes = await pdfDoc.save();
  //   fs.writeFileSync(pdfFilePath, pdfBytes);
  // }
}
