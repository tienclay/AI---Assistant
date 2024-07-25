import { Module, forwardRef } from '@nestjs/common';
import { ConversationModule } from '../conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { AIChatbotModule } from '../ai-chatbot/ai.module';

@Module({
  imports: [ConversationModule, forwardRef(() => AIChatbotModule)],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class RealtimeModule {}
