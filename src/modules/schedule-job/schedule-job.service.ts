import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleJob } from 'database/entities/schedule-job.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ScheduleJobDto } from './dto/create-job.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JobStatus } from 'src/common/enums/schedule-job.enum';

@Injectable()
export class ScheduleJobService {
  constructor(
    @InjectRepository(ScheduleJob)
    private scheduleJobRepository: Repository<ScheduleJob>,
    @InjectQueue('SCHEDULE_TASK')
    private readonly scheduleTask: Queue,
  ) {}

  async getAllScheduleJob(): Promise<ScheduleJob[]> {
    return await this.scheduleJobRepository.find();
  }

  async getScheduleJobById(id: string): Promise<ScheduleJob> {
    return await this.scheduleJobRepository.findOneBy({ id });
  }

  async createScheduleJob(
    userId: string,
    createScheduleJobDto: ScheduleJobDto,
  ): Promise<ScheduleJob> {
    const scheduleJobInput = await this.scheduleJobRepository.create({
      ...createScheduleJobDto,
      userId,
    });
    return this.scheduleJobRepository.save(scheduleJobInput);
  }

  async updateScheduleJob(id: string, dto: ScheduleJobDto): Promise<boolean> {
    const updated = await this.scheduleJobRepository.update(id, dto);
    if (updated.affected === 0) {
      return false;
    }
    return true;
  }

  async deleteScheduleJob(id: string): Promise<boolean> {
    const deleted = await this.scheduleJobRepository.delete(id);
    if (deleted.affected === 0) {
      return false;
    }
    return true;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    // get all job in db
    const activeJobs = await this.getAllActiveJobs();
    // push task into queue
    activeJobs.forEach(async (activeJob) => {
      await this.scheduleTask.add('handle-shedule-task', activeJob),
        (activeJob.status = JobStatus.PROCESSING);
    });
  }

  async getAllActiveJobs(): Promise<ScheduleJob[]> {
    const currentTime = new Date();

    return await this.scheduleJobRepository.find({
      where: {
        active: true,
        status: JobStatus.PENDING,
        nextExecutionTime: LessThanOrEqual(currentTime),
      },
    });
  }

  async updateTaskAfterExecution(id: string): Promise<boolean> {
    const task = await this.scheduleJobRepository.findOneBy({ id });
    const updateField = { status: null, nextExecutionTime: null };
    if (!task.isRecurring) {
      updateField.status = JobStatus.SUCCESS;
      updateField.nextExecutionTime = task.nextExecutionTime;
    } else {
      updateField.status = JobStatus.PENDING;
      updateField.nextExecutionTime = new Date(
        task.nextExecutionTime.getTime() + task.interval * 1000,
      );
    }
    const updated = await this.scheduleJobRepository.update(id, updateField);
    if (updated.affected === 0) {
      return false;
    }
    return true;
  }
}
