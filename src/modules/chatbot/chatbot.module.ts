import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatbot, Knowledge } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([Chatbot, Knowledge])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
