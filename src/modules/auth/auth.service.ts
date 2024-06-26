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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async onModuleInit(): Promise<void> {
  //   const _test = await this.login({
  //     email: 'admin@gmail.com',
  //     password: '12345678',
  //   });

  //   console.log('1111 :>> ', 1111);
  // }

  async login(payload: LoginDto): Promise<IAccessToken> {
    const { email, password } = payload;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('*')
      .where('email = :email', { email })
      .getRawOne();

    const userPayload = {
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
    };

    const userPassword = user.password;

    console.log('userPassword :>> ', userPassword);

    const authen = await bcrypt.compare(password, userPassword);
    if (authen) {
      console.log('1111 :>> ', 1111);
      console.log('userPayload :>> ', userPayload);

      return this.generateAccessTokem(userPayload);
    }
    throw new UnauthorizedException();
  }
  generateAccessTokem(userPayload: AuthPayloadDto): IAccessToken {
    console.log('userPayload :>> ', userPayload);

    return {
      accessToken: this.jwtService.sign(userPayload),
    };
  }
}
