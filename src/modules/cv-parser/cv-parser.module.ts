import { Module } from '@nestjs/common';
import { CvParserService } from './cv-parser.service';
import { CvParserController } from './cv-parser.controller';
import { AIChatbotModule } from '../ai-chatbot/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent, Chatbot } from '@entities';

@Module({
  imports: [AIChatbotModule, TypeOrmModule.forFeature([Agent, Chatbot])],
  providers: [CvParserService],
  controllers: [CvParserController],
})
export class CvParserModule {}
