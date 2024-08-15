import { IAccessToken } from './../../common/interfaces/jwt.interface';
import { LoginPasswordDto } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { AuthPayload } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(payload: LoginPasswordDto): Promise<IAccessToken> {
    const { email, password } = payload;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('email = :email', { email })
      .getRawOne();

    if (!user) throw new UnauthorizedException();

    const userPassword = user.password;
    const comparePassword = await bcrypt.compare(password, userPassword);

    const userPayload = this.getPlainUserPayload(user);

    if (comparePassword) {
      return this.generateAccessToken(userPayload);
    }
    throw new UnauthorizedException();
  }

  getPlainUserPayload(user: User): AuthPayloadDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
    };
  }

  async getUserPayload(email: string): Promise<AuthPayloadDto> {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return plainToInstance(AuthPayloadDto, user);
  }

  generateAccessToken(userPayload: AuthPayload): IAccessToken {
    return {
      accessToken: this.jwtService.sign(userPayload),
    };
  }
}
