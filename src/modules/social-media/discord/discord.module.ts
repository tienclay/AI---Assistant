import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DiscordConfig } from 'src/config';
import { DiscordService } from './discord.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [DiscordConfig.KEY],
      useFactory: (discordConfig: ConfigType<typeof DiscordConfig>) => {
        const { baseURL, headers } = discordConfig;
        return {
          baseURL,
          headers,
        };
      },
    }),
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
