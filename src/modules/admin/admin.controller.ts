import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './admin.service';
import { UserInputDto, UserOutputDto } from './dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AiAssistantApiResponse, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums/user.enum';
import { PromptDto } from '../agent/dto/prompt-data.dto';

@Controller('admin')
@ApiTags('Admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  createCompanyAgent() {
    // create user profile
    // create agent
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(UserOutputDto)
  @Post()
  async create(@Body() userInputDto: UserInputDto): Promise<UserOutputDto> {
    return this.userService.createUser(userInputDto);
  }
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(UserOutputDto, true)
  @Get()
  async findAll(): Promise<UserOutputDto[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(UserOutputDto, true)
  @Get('clients')
  async getAllClient(): Promise<UserOutputDto[]> {
    return this.userService.getAllClient();
  }
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(PromptDto)
  @Get('example-prompt')
  getPrompt() {
    return this.userService.getPrompt();
  }
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(UserOutputDto)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(UserOutputDto)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UserInputDto) {
    return this.userService.update(id, updateUserDto);
  }
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(UserOutputDto)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
