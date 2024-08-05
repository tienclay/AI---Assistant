import { IsString, IsOptional } from 'class-validator';

export class UpdateChannelDto {
  @IsString()
  @IsOptional()
  chatbotId?: string;

  @IsString()
  @IsOptional()
  conversationid?: string;

  @IsString()
  @IsOptional()
  channelId?: string;
}
