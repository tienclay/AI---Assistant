import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AiAssistantApiResponse } from 'src/common/decorators/api-response.decorator';
import { AuthPayloadDto, AuthToken } from '../dto';
import { AuthEmailService } from './auth-email.service';
import {
  EmailInputDto,
  EmailRegisterInputDto,
  EmailRegisterResponseDto,
  SendOtpResponseDto,
} from './dtos';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '../guard';
import { CurrentUser } from 'src/common/decorators';

@ApiTags('Auth-email')
@Controller('auth-email')
export class AuthEmailController {
  constructor(private readonly authEmailService: AuthEmailService) {}
  @Post('register')
  @AiAssistantApiResponse(EmailRegisterResponseDto)
  async register(
    @Body() registerDto: EmailRegisterInputDto,
  ): Promise<EmailRegisterResponseDto> {
    // call service to register an account
    return this.authEmailService.register(registerDto);
  }

  @Post('request-send-otp')
  @AiAssistantApiResponse(SendOtpResponseDto)
  async sendOtp(
    @Body() inputEmail: EmailInputDto,
  ): Promise<Partial<SendOtpResponseDto>> {
    // call service to send email
    return this.authEmailService.sendOtp(inputEmail);
  }

  @Post('otp-login')
  @AiAssistantApiResponse(AuthToken)
  async login(@Body() loginOtp: LoginDto): Promise<AuthToken> {
    // call service to validate login
    return this.authEmailService.login(loginOtp);
  }

  @Post('active-user')
  @AiAssistantApiResponse(AuthToken)
  async active(@Body() loginOtp: LoginDto): Promise<AuthToken> {
    // call service to validate login
    return this.authEmailService.activeUser(loginOtp);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(AuthPayloadDto)
  @Get('me')
  getCurrentUser(@CurrentUser() currentUser: AuthPayloadDto): AuthPayloadDto {
    return currentUser;
  }

  @Post('logout')
  async logout() {
    return this.authEmailService.logout();
  }
}
