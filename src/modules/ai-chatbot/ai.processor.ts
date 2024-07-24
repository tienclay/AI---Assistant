import { Process, Processor } from '@nestjs/bull';
import { AI_QUEUE_JOB, AI_QUEUE_NAME, aiServiceUrl } from './constants';
import { Job } from 'bull';
import { LoadKnowledgeInterface } from './interfaces';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Processor(AI_QUEUE_NAME)
export class AiProcessor {
  constructor(private httpService: HttpService) {}

  @Process(AI_QUEUE_JOB.LOAD_KNOWLEDGE)
  async loadKnowledge(job: Job<LoadKnowledgeInterface>) {
    const loadKnowledgeInput = job.data;
    await lastValueFrom(
      this.httpService.post(aiServiceUrl.loadKnowledge, {
        ...loadKnowledgeInput,
      }),
    );
  }
}
