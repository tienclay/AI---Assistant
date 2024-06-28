import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AIService } from './ai.service';
import {
  AiAssistantApiResponse,
  CurrentUser,
  Roles,
} from 'src/common/decorators';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@entities';
import { LoadKnowledgeDto } from './dto/load-knowledge.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller()
@ApiTags('AI-Service')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  // @Post('knowledge')
  // @Roles(UserRole.CLIENT)
  // @ApiConsumes('multipart/form-data')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Knowledge file' })
  // @UseInterceptors(FileInterceptor('file'))
  // @AiAssistantApiResponse(Boolean)
  // loadKnowledge(
  //   @Body() __: UploadCvDto,
  //   @UploadedFile(new UploadFilePipe()) file: Express.Multer.File,
  // ): Promise<boolean> {
  //   return Promise.resolve(true);
  // }

  @Post('load-knowledge')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(Boolean)
  loadKnowledge(
    @CurrentUser() user: User,
    @Body() dto: LoadKnowledgeDto,
  ): Promise<boolean> {
    return this.aiService.loadKnowledge(user.id, dto.urls);
  }
}
