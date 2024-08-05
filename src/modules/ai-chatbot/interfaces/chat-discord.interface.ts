import { AssistantChatInterface } from './chat.interface';
export interface UserDiscord {
  avatar: string | null;
  avatar_decoration_data: string | null;
  clan: string | null;
  discriminator: string;
  global_name: string;
  id: string;
  public_flags: number;
  username: string;
}
export interface AssistantChatDiscordInterface {
  chatInput: AssistantChatInterface;
  channelId: string;
  userId: string;
  messageRequest: string;
  discordToken: string;
}
