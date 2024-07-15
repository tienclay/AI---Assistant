import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatbot, Conversation, Message } from '@entities';
import { AIChatbotModule } from '../ai-chatbot/ai.module';
import { MessageService } from '../message/message.service';
import { MessageModule } from '../message/message.module';
import { AIService } from '../ai-chatbot/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), MessageModule],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
