import {
  FileTypeValidator,
  HttpStatus,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

@Injectable()
export class UploadFilePipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1000 * 1000 }), // 5MB
        new FileTypeValidator({
          // allow mime type file pdf, doc, docx, rtf, html
          fileType:
            'application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/rtf|text/html',
        }),
      ],
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }
}
