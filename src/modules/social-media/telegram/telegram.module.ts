import { Module, forwardRef } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelegramChatbot } from 'database/entities/telegram-chatbot.entity';
import { TelegramParticipant } from 'database/entities/telegram-participant.entity';
import { AIChatbotModule } from 'src/modules/ai-chatbot/ai.module';
import { TelegramAccount } from 'database/entities/telegram-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TelegramChatbot,
      TelegramParticipant,
      TelegramAccount,
    ]),
    forwardRef(() => AIChatbotModule),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
