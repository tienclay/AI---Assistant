import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { UploadFilePipe } from 'src/common/pipe/upload-file.pipe';
import { AiAssistantApiResponse, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadCvDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
@ApiTags('AI-Service')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('knowledge')
  @Roles(UserRole.CLIENT)
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Knowledge file' })
  @UseInterceptors(FileInterceptor('file'))
  @AiAssistantApiResponse(Boolean)
  loadKnowledge(
    @Body() __: UploadCvDto,
    @UploadedFile(new UploadFilePipe()) file: Express.Multer.File,
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
