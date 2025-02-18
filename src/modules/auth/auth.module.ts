import { Module } from '@nestjs/common';
import { UserModule } from '../admin/admin.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
