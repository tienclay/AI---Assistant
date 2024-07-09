import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserInputDto {
  @IsString()
  @ApiProperty({ example: 'Thanh' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'thanhvo@codelight.co' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '12345678' })
  password?: string;
}

export class UserUpdateDto {
  @IsString()
  @ApiProperty({ example: 'Thanh' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '12345678' })
  password?: string;
}
