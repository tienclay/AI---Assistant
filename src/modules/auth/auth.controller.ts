import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guard/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthPayloadDto, AuthToken } from './dto';
import { AiAssistantApiResponse } from 'src/common/decorators';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AiAssistantApiResponse(AuthToken)
  async login(@Body() loginDto: LoginDto): Promise<AuthToken> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(AuthPayloadDto)
  @Get('me')
  getCurrentUser(@CurrentUser() currentUser: AuthPayloadDto): AuthPayloadDto {
    return currentUser;
  }
}
