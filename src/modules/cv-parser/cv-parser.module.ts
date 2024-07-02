import { Module } from '@nestjs/common';
import { CvParserService } from './cv-parser.service';
import { CvParserController } from './cv-parser.controller';
import { AIModule } from '../ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@entities';

@Module({
  imports: [AIModule, TypeOrmModule.forFeature([Agent])],
  providers: [CvParserService],
  controllers: [CvParserController],
})
export class CvParserModule {}
