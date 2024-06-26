import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthPayloadDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() currentUser: AuthPayloadDto) {
    console.log(currentUser);
  }
}
