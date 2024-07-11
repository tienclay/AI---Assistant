import { User } from '@entities';
import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NovuProcessor } from './novu.processor';
import { NovuService } from './novu.service';
import { NOVU_QUEUE_NAME } from './queue';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: NOVU_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: {
          count: 1000,
        },
      },
    }),
  ],
  providers: [NovuService, NovuProcessor],
  exports: [NovuService],
})
export class NovuModule {}
