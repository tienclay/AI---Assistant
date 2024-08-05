import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatbotDiscordResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  discordToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  publicKey: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  appId: string;
}
