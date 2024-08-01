import { Module, forwardRef } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramChatbot } from 'database/entities/telegram.entity';
import { TelegramPartitipant } from 'database/entities/telegram-participant.entity';
import { AIChatbotModule } from 'src/modules/ai-chatbot/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramChatbot, TelegramPartitipant]),
    forwardRef(() => AIChatbotModule),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
