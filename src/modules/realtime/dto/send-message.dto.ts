import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hello' })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  runId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
