import { Agent, Chatbot, User } from '@entities';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { parseCvPrompt } from './config/parse-cv-prompt';

interface AgentInterface {
  companyName: string;
  userId: string;
  prompt: string;
}

interface ChatbotInterface {
  name: string;
  createdById: string;
  prompt: string;
}

export default class ParseCvAgent implements Seeder {
  private async createParseCvAgent(appDataSource: DataSource): Promise<any> {
    const adminUser = await appDataSource.manager.findOneOrFail(User, {
      where: {
        email: 'admin@gmail.com',
      },
    });

    const agentRawInput: AgentInterface = {
      companyName: 'CV_Parser',
      userId: adminUser.id,
      prompt: parseCvPrompt,
    };

    const agentInput = appDataSource.manager.create(Agent, agentRawInput);
    try {
      await appDataSource
        .createQueryBuilder()
        .insert()
        .into(Agent)
        .values(agentInput)
        .execute();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private async createParseCvChatbot(appDataSource: DataSource): Promise<any> {
    const adminUser = await appDataSource.manager.findOneOrFail(User, {
      where: {
        email: 'admin@gmail.com',
      },
    });

    const chatbotRawInput: ChatbotInterface = {
      name: 'CV_Parser',
      createdById: adminUser.id,
      prompt: parseCvPrompt,
    };

    const chatbotInput = appDataSource.manager.create(Chatbot, chatbotRawInput);
    try {
      await appDataSource
        .createQueryBuilder()
        .insert()
        .into(Chatbot)
        .values(chatbotInput)
        .execute();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async run(appDataSource: DataSource): Promise<any> {
    try {
      // await this.createParseCvAgent(appDataSource);
      await this.createParseCvChatbot(appDataSource);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
