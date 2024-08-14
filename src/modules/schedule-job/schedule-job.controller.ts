import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScheduleJobService } from './schedule-job.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from 'src/common/enums/user.enum';
import { CurrentUser, Roles } from 'src/common/decorators';
import { ScheduleJobDto } from './dto/create-job.dto';
import { User } from '@entities';
import { RolesGuard, AuthGuard } from '../auth/guard';
import { ScheduleJob } from 'database/entities/schedule-job.entity';

@Controller('schedulejob')
@ApiTags('ScheduleJob')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class ScheduleJobController {
  constructor(private readonly scheduleJobService: ScheduleJobService) {}

  @Get()
  @Roles(UserRole.CLIENT)
  async getScheduleJob(): Promise<ScheduleJob[]> {
    return await this.scheduleJobService.getAllScheduleJob();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT)
  async getScheduleJobById(id: string): Promise<ScheduleJob> {
    return await this.scheduleJobService.getScheduleJobById(id);
  }

  @Post()
  @Roles(UserRole.CLIENT)
  async createScheduleJob(
    @Body() createScheduleJobDto: ScheduleJobDto,
    @CurrentUser() user: User,
  ) {
    return await this.scheduleJobService.createScheduleJob(
      user.id,
      createScheduleJobDto,
    );
  }

  @Patch()
  @Roles(UserRole.CLIENT)
  async updateScheduleJob(id: string, dto: ScheduleJobDto): Promise<boolean> {
    return await this.scheduleJobService.updateScheduleJob(id, dto);
  }

  @Delete()
  @Roles(UserRole.CLIENT)
  async deleteScheduleJob(id: string): Promise<boolean> {
    return await this.scheduleJobService.deleteScheduleJob(id);
  }
}
