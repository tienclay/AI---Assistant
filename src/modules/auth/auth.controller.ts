import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthPayloadDto } from './dto';
import { IAccessToken } from 'src/common/interfaces/jwt.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { RolesGuard } from './role.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<IAccessToken> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() currentUser: AuthPayloadDto) {
    return currentUser;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdminUser(@CurrentUser() user: AuthPayloadDto): void {
    console.log('user :>> ', user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Get('client')
  getClientUser(@CurrentUser() user: AuthPayloadDto): void {
    console.log('user :>> ', user);
  }
}
