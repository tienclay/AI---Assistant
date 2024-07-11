import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseConversationDto {
  @Expose()
  id: string;
  @Expose()
  chatbotId: string;
  @Expose()
  title: string;
  @Expose()
  participantId: string;
  @Expose()
  lastMessageId?: string | null;
}
