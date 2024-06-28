import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AiServiceConfig } from 'src/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '@entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),
    HttpModule.registerAsync({
      inject: [AiServiceConfig.KEY],
      useFactory: (aiServiceConfig: ConfigType<typeof AiServiceConfig>) => {
        const { baseURL, headers } = aiServiceConfig;
        return {
          baseURL,
          headers,
        };
      },
    }),
  ],

  providers: [AIService],
  controllers: [AIController],
  exports: [AIService],
})
export class AIModule {}
