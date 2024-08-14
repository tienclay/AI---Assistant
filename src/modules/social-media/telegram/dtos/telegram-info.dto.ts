import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class TelegramInfoDto {
  @IsString()
  @ApiProperty({ example: '981234322' })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ example: '98123124' })
  apiId: string;

  @IsString()
  @ApiProperty({ example: '23asd4' })
  apiHash: string;
}
