import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hello' })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
