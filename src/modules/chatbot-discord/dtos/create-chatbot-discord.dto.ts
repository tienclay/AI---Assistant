import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatbotDiscordDto {
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
