import { Module } from '@nestjs/common';
import { ChatbotDiscordService } from './chatbot-discord.service';
import { ChatbotDiscordController } from './chatbot-discord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotDiscord } from 'database/entities/chatbot.discord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatbotDiscord])],
  providers: [ChatbotDiscordService],
  controllers: [ChatbotDiscordController],
  exports: [ChatbotDiscordService],
})
export class ChatbotDiscordModule {}
