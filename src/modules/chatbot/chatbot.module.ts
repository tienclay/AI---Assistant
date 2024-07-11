import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatbot, Knowledge } from '@entities';
import { AIChatbotModule } from '../ai-chatbot/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chatbot, Knowledge]), AIChatbotModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
