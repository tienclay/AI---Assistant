// create-channel.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ReponseChannelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  chatbotId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
