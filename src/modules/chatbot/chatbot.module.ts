import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ChatbotPropertyService } from './chatbot-property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatbot, ChatbotProperty } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([Chatbot, ChatbotProperty])],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotPropertyService],
})
export class ChatbotModule {}
