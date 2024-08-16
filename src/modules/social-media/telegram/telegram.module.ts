import { Module, forwardRef } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelegramChatbot } from 'database/entities/telegram-chatbot.entity';
import { TelegramParticipant } from 'database/entities/telegram-participant.entity';
import { AIChatbotModule } from 'src/modules/ai-chatbot/ai.module';
import { TelegramAccount } from 'database/entities/telegram-account.entity';
import { TelegramController } from './telegram.controller';
import { TelegramServiceV2 } from './v2.telegram.service';
import { TelegramManageChatbotService } from './services/telegram-manage-chatbot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TelegramChatbot,
      TelegramParticipant,
      TelegramAccount,
    ]),
    forwardRef(() => AIChatbotModule),
  ],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramServiceV2, TelegramManageChatbotService],
  exports: [TelegramService],
})
export class TelegramModule {}
