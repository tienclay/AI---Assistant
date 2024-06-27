import { IAccessToken } from './../../common/interfaces/jwt.interface';
import { LoginDto } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(payload: LoginDto): Promise<IAccessToken> {
    const { email, password } = payload;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('email = :email', { email })
      .getRawOne();

    if (!user) throw new UnauthorizedException();

    const userPassword = user.password;
    const comparePassword = await bcrypt.compare(password, userPassword);

    const userPayload = await this.getPlainUserPayload(user);

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
      name: user.name,
      status: user.status,
    };
  }

  async getUserPayload(email: string): Promise<AuthPayloadDto> {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return plainToInstance(AuthPayloadDto, user);
  }

  generateAccessToken(userPayload: AuthPayloadDto): IAccessToken {
    return {
      accessToken: this.jwtService.sign(userPayload),
    };
  }
}
