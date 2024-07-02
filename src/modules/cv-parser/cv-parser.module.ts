import { Module } from '@nestjs/common';
import { CvParserService } from './cv-parser.service';
import { CvParserController } from './cv-parser.controller';
import { AIModule } from '../ai/ai.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Agent } from '@entities';
import { AiDatabaseConfig } from 'src/config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    AIModule,
    TypeOrmModule.forFeature([Agent]),
    TypeOrmModule.forRootAsync({
      name: 'cv-parser', // 'cv-parser' is the name of the database connection in the config file 'ai-database.config.ts
      inject: [AiDatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof AiDatabaseConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without ORM config');
        }
        return config as TypeOrmModuleOptions;
      },
    }),
  ],
  providers: [CvParserService],
  controllers: [CvParserController],
})
export class CvParserModule {}
