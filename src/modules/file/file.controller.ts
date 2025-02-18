import { FileService } from './file.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AiAssistantApiResponse, Roles } from 'src/common/decorators';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserRole } from 'src/common/enums/user.enum';
import { File } from 'database/entities/file.entity';
import { UploadFileDto, UploadFileResponseDto } from './dto';
import { UploadFilePipe } from 'src/common/pipe/upload-file.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
@ApiTags('File')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/:agent_id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload User File' })
  @UseInterceptors(FileInterceptor('file'))
  @AiAssistantApiResponse(File)
  uploadUserImage(
    @Param('agent_id') id: string,
    @Body() data: UploadFileDto,
    @UploadedFile(new UploadFilePipe())
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.fileService.upload(id, data, file);
  }
}
