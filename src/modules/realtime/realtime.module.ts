import { Module } from '@nestjs/common';
import { ConversationModule } from '../conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { AIChatbotModule } from '../ai-chatbot/ai.module';

@Module({
  imports: [ConversationModule, AIChatbotModule],
  providers: [ChatGateway],
})
export class RealtimeModule {}
