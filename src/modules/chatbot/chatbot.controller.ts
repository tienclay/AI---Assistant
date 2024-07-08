import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../auth/guard';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { User } from '@entities';

@Controller('chatbot')
@ApiTags('Chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new chat bot' })
  @ApiBearerAuth('access-token')
  create(@Body() createChatbotDto: CreateChatbotDto) {
    return this.chatbotService.create(createChatbotDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new chat bot' })
  @ApiBearerAuth('access-token')
  findAll(@CurrentUser() user: User) {
    return this.chatbotService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a chat bot' })
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string) {
    return this.chatbotService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a chat bot' })
  update(@Param('id') id: string, @Body() updateChatbotDto: UpdateChatbotDto) {
    return this.chatbotService.update(id, updateChatbotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatbotService.remove(id);
  }
}
