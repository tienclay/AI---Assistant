import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramPartitipant } from 'database/entities/telegram-participant.entity';
import { TelegramChatbot } from 'database/entities/telegram.entity';
import { AIService } from 'src/modules/ai-chatbot/ai.service';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Repository } from 'typeorm';
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: any;
  private teleBot: any;

  constructor(
    @InjectRepository(TelegramChatbot)
    private telegramChatbotRepository: Repository<TelegramChatbot>,
    @InjectRepository(TelegramPartitipant)
    private telegramParticipantRepository: Repository<TelegramPartitipant>,
    private readonly aiService: AIService,
  ) {
    // this.bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  }

  async onModuleInit() {
    // await this.initTelegraf();
  }

  async getOrCreateRunId(userId: string, telegramChatbotId: string) {
    const telegramChatbot =
      await this.getTelegramChatbotByBotId(telegramChatbotId);

    const telegramParticipant =
      await this.telegramParticipantRepository.findOne({
        where: { telegramUserId: userId, telegramId: telegramChatbot.id },
      });
    if (telegramParticipant) {
      return telegramParticipant;
    }

    const agentRun = await this.aiService.createAgentRunSocialMedia(
      telegramChatbot.chatbot.id,
      userId.toString(),
    );

    const newParticipant = this.telegramParticipantRepository.create({
      telegramId: telegramChatbot.id,
      telegramUserId: userId,
      runId: agentRun.runId,
    });

    return this.telegramParticipantRepository.save(newParticipant);
  }

  private async getTelegramChatbotByBotId(
    telegramBotId: string,
  ): Promise<TelegramChatbot> {
    const telegramChatbot = await this.telegramChatbotRepository.findOne({
      where: { telegramBotId },
      relations: ['chatbot'],
    });

    if (!telegramChatbot)
      throw new BadRequestException('Telegram chatbot not found');

    return telegramChatbot;
  }

  async initTelegraf() {
    this.bot.start((ctx) => ctx.reply('Welcome'));

    this.bot.on(message('text'), async (ctx) => {
      const botId = ctx.botInfo.id;
      const bot = await this.getTelegramChatbotByBotId(botId);

      const userChatbotId = ctx.message.chat.id;
      const message = ctx.message.text;
      const botParticipant = await this.getOrCreateRunId(userChatbotId, botId);

      await this.aiService.sendMessageTelegram(
        bot.chatbotId,
        userChatbotId,

        {
          message,
          runId: botParticipant.runId,
          userId: botParticipant.telegramUserId,
        },
      );
    });

    this.bot.on('callback_query', async (ctx) => {
      // Explicit usage
      await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

      // Using context shortcut
      await ctx.answerCbQuery();
    });

    this.bot.launch();
  }

  async sendTelegramMessageBack(chatId: string, message: string) {
    this.bot.telegram.sendMessage(chatId, message);
  }
}
