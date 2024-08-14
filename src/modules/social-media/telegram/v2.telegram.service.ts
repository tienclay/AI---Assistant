import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramChatbot } from 'database/entities/telegram-chatbot.entity';
import { Repository } from 'typeorm';
import {
  AIAssistantBadRequestException,
  Exception,
} from 'src/common/infra-exception';
import {
  StartTelegramChatbotResponseDto,
  StopTelegramChatbotResponseDto,
} from './dtos';
import { TelegramAccount } from '@entities';
import { TelegramInfoDto } from './dtos/telegram-info.dto';
import { TelegramChatbotDto } from './dtos/telegram-chatbot-info.dto';
import { TelegramManageChatbotService } from './services/telegram-manage-chatbot.service';

@Injectable()
export class TelegramServiceV2 {
  private readonly logger = new Logger(TelegramServiceV2.name);

  constructor(
    @InjectRepository(TelegramChatbot)
    private readonly telegramChatbotRepository: Repository<TelegramChatbot>,

    @InjectRepository(TelegramAccount)
    private readonly telegramAccountRepository: Repository<TelegramAccount>,

    private readonly telegramManageChatbotService: TelegramManageChatbotService,
  ) {}

  async getAllTelegramAccounts(): Promise<TelegramAccount[]> {
    return await this.telegramAccountRepository.find();
  }

  async getTelegramAccounts(userId: string): Promise<TelegramAccount[]> {
    try {
      const accounts: TelegramAccount[] =
        await this.telegramAccountRepository.find({
          where: { userId },
        });

      return accounts;
    } catch (error) {
      throw new AIAssistantBadRequestException(
        'Failed to fetch Telegram accounts',
      );
    }
  }

  async createTelegramAccount(
    userId: string,
    dto: TelegramInfoDto,
  ): Promise<TelegramAccount> {
    try {
      // Validate if the phone number is unique
      const existingAccount: TelegramAccount | undefined =
        await this.telegramAccountRepository.findOne({
          where: { phoneNumber: dto.phoneNumber },
        });

      if (existingAccount) {
        throw new AIAssistantBadRequestException('Phone number already exists');
      }

      const telegramAccountInput: TelegramAccount =
        this.telegramAccountRepository.create({
          userId,
          ...dto,
        });

      return await this.telegramAccountRepository.save(telegramAccountInput);
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Failed to create Telegram account',
      );
    }
  }

  async updateTelegramAccount(
    id: string,
    userId: string,
    dto: TelegramInfoDto,
  ): Promise<boolean> {
    try {
      // Validate if the account exists and belongs to the user
      const existingAccount: TelegramAccount | undefined =
        await this.telegramAccountRepository.findOne({
          where: { id, userId },
        });

      if (!existingAccount) {
        throw new AIAssistantBadRequestException(
          'Telegram account not found or does not belong to the user',
        );
      }

      // Validate if the new phone number is unique
      if (dto.phoneNumber !== existingAccount.phoneNumber) {
        const existingAccountWithNewPhoneNumber: TelegramAccount | undefined =
          await this.telegramAccountRepository.findOne({
            where: { phoneNumber: dto.phoneNumber },
          });

        if (existingAccountWithNewPhoneNumber) {
          throw new AIAssistantBadRequestException(
            'Phone number already exists',
          );
        }
      }

      const updated = await this.telegramAccountRepository.update(id, {
        userId,
        ...dto,
      });

      if (updated.affected === 0) {
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Failed to update Telegram account',
      );
    }
  }

  async deleteTelegramAccount(id: string, userId: string): Promise<boolean> {
    try {
      // Validate if the account exists and belongs to the user
      const existingAccount: TelegramAccount | undefined =
        await this.telegramAccountRepository.findOne({
          where: { id, userId },
        });

      if (!existingAccount) {
        throw new AIAssistantBadRequestException(
          'Telegram account not found or does not belong to the user',
        );
      }

      // Check if there are any associated chatbots
      const associatedChatbots: TelegramChatbot[] =
        await this.telegramChatbotRepository.find({
          where: { accountId: id },
        });

      if (associatedChatbots.length > 0) {
        throw new AIAssistantBadRequestException(
          'Cannot delete account with associated chatbots',
        );
      }

      const deleted = await this.telegramAccountRepository.delete(id);

      if (deleted.affected === 0) {
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Failed to delete Telegram account',
      );
    }
  }

  async getTelegramChatbots(): Promise<TelegramChatbot[]> {
    return await this.telegramChatbotRepository.find();
  }

  async getTelegramChatbotsByAccountIdAndUserId(
    accountId: string,
    userId: string,
  ): Promise<TelegramChatbot[]> {
    try {
      return await this.telegramChatbotRepository.find({
        where: {
          account: {
            id: accountId,
            userId,
          },
        },
      });
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error fetching Telegram chatbots for user',
      );
    }
  }

  async startTelegramChatbotByUser(
    accountId: string,
    chatbotId: string,
    userId: string,
  ): Promise<StartTelegramChatbotResponseDto> {
    try {
      const telegramChatbot: TelegramChatbot | undefined =
        await this.telegramChatbotRepository.findOne({
          where: { id: chatbotId, account: { id: accountId, userId } },
          relations: ['account'],
        });

      if (!telegramChatbot) {
        throw new AIAssistantBadRequestException('Telegram chatbot not found');
      }

      return await this.telegramManageChatbotService.startTelegramChatbot(
        telegramChatbot.telegramChatbotId,
      );
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error starting Telegram chatbot for user',
      );
    }
  }

  async stopTelegramChatbotByUser(
    accountId: string,
    chatbotId: string,
    userId: string,
  ): Promise<StopTelegramChatbotResponseDto> {
    try {
      const telegramChatbot: TelegramChatbot | undefined =
        await this.telegramChatbotRepository.findOne({
          where: { id: chatbotId, account: { id: accountId, userId } },
          relations: ['account'],
        });

      if (!telegramChatbot) {
        throw new AIAssistantBadRequestException('Telegram chatbot not found');
      }

      return await this.telegramManageChatbotService.stopTelegramChatbot(
        telegramChatbot.telegramChatbotId,
      );
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error stopping Telegram chatbot for user',
      );
    }
  }

  async getTelegramChatbotByAccountIdAndChatbotId(
    accountId: string,
    chatbotId: string,
    userId: string,
  ): Promise<TelegramChatbot> {
    try {
      const telegramChatbot: TelegramChatbot | undefined =
        await this.telegramChatbotRepository.findOne({
          where: {
            id: chatbotId,
            account: { id: accountId, userId },
          },
        });

      if (!telegramChatbot) {
        throw new AIAssistantBadRequestException(
          'Telegram chatbot not found or does not belong to the user',
        );
      }

      return telegramChatbot;
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error retrieving Telegram chatbot',
      );
    }
  }

  async createTelegramChatbot(
    accountId: string,
    userId: string,
    dto: TelegramChatbotDto,
  ): Promise<TelegramChatbot> {
    try {
      // Check if the account exists
      const account: TelegramAccount | undefined =
        await this.telegramAccountRepository.findOne({
          where: { id: accountId, userId },
        });

      if (!account) {
        throw new AIAssistantBadRequestException('Telegram account not found');
      }

      // Check if the telegramChatbotId is unique
      const existingChatbot: TelegramChatbot | undefined =
        await this.telegramChatbotRepository.findOne({
          where: { telegramChatbotId: dto.telegramChatbotId },
        });

      if (existingChatbot) {
        throw new AIAssistantBadRequestException(
          'A Telegram chatbot with this ID already exists',
        );
      }

      const telegramChatbotInput = this.telegramChatbotRepository.create({
        ...dto,
        account: { id: accountId },
      });

      return await this.telegramChatbotRepository.save(telegramChatbotInput);
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error creating Telegram chatbot',
      );
    }
  }

  async updateTelegramChatbot(
    accountId: string,
    chatbotId: string,
    userId: string,
    dto: TelegramChatbotDto,
  ): Promise<boolean> {
    try {
      const telegramChatbot: TelegramChatbot | undefined =
        await this.telegramChatbotRepository.findOne({
          where: { id: chatbotId, account: { id: accountId, userId } },
        });

      if (!telegramChatbot) {
        throw new AIAssistantBadRequestException(
          'Telegram chatbot not found or does not belong to the user',
        );
      }

      const updated = await this.telegramChatbotRepository.update(
        chatbotId,
        dto,
      );

      if (updated.affected === 0) {
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error updating Telegram chatbot',
      );
    }
  }

  async deleteTelegramChatbot(
    accountId: string,
    chatbotId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      const telegramChatbot: TelegramChatbot | undefined =
        await this.telegramChatbotRepository.findOne({
          where: { id: chatbotId, account: { id: accountId, userId } },
        });

      if (!telegramChatbot) {
        throw new AIAssistantBadRequestException(
          'Telegram chatbot not found or does not belong to the user',
        );
      }

      const deleted = await this.telegramChatbotRepository.delete(chatbotId);

      if (deleted.affected === 0) {
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof AIAssistantBadRequestException) {
        throw error;
      }
      throw new AIAssistantBadRequestException(
        'Error deleting Telegram chatbot',
      );
    }
  }
}
