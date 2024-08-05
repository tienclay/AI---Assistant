import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatbotDiscordDto {
  @IsString()
  @IsNotEmpty()
  discordToken?: string;

  @IsString()
  @IsNotEmpty()
  publicKey?: string;

  @IsString()
  @IsNotEmpty()
  appId?: string;
}
