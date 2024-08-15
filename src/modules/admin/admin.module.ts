import { Module } from '@nestjs/common';
import { UserService } from './admin.service';
import { UserController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
