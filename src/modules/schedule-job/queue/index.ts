import { JobDataDto } from '../dto/create-job.dto';

export const SCHEDULE_JOB_QUEUE_NAME = 'SCHEDULE_JOB_TELEGRAM';
export const SCHEDULE_JOB_QUEUE_JOBS = {
  TELEGRAM_AUTO_MESSAGE: 'handle-shedule-job',
};

export interface ScheduleJobData {
  id: string;
  data: JobDataDto;
}
