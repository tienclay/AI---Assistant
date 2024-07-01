import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserInputDto, UserOutputDto } from './dto';
import { hashPassword } from 'src/common/utils/hash-password.util';
import { plainToInstance } from 'class-transformer';
import { PromptDto } from '../agent/dto/prompt-data.dto';
import * as promptData from './json/enum-data.json';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(dto: UserInputDto): Promise<UserOutputDto> {
    try {
      const userInput = this.userRepository.create({
        ...dto,
        status: UserStatus.ACTIVE,
        password: await hashPassword(dto.password),
      });

      const saveUser = await this.userRepository.save(userInput);
      return plainToInstance(UserOutputDto, saveUser);
    } catch (e) {
      throw new BadRequestException('User already exists');
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async getAllClient(): Promise<UserOutputDto[]> {
    return this.userRepository.find({
      where: {
        role: UserRole.CLIENT,
      },
    });
  }

  async findAll(): Promise<UserOutputDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => plainToInstance(UserOutputDto, user));
  }
  async remove(id: string) {
    try {
      await this.userRepository.update({ id }, { status: UserStatus.INACTIVE });
      return 'Delete successfully';
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  async update(id: string, updateUserDto: UserInputDto) {
    try {
      await this.userRepository.update({ id }, updateUserDto);
      return plainToInstance(UserOutputDto, updateUserDto);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  async findOne(id: string): Promise<UserOutputDto> {
    try {
      const user = await this.userRepository.findOneByOrFail({ id });
      return plainToInstance(UserOutputDto, user);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  getPrompt(): PromptDto {
    return plainToInstance(PromptDto, promptData);
  }
}
