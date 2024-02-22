import { Module } from '@nestjs/common';
import { DocxController } from './docx.controller';
import { DocxService } from './docx.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: 'temp/', // Thư mục tạm thời để lưu trữ tệp .docx
    }),
  ],
  controllers: [DocxController],
  providers: [DocxService],
})
export class DocxModule {}
