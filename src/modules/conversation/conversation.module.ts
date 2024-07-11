import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from '@entities';
import { AIChatbotModule } from '../ai-chatbot/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AIChatbotModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
