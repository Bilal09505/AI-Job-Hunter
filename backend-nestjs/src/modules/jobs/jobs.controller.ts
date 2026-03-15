import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('search')
  async searchJobs(
    @Query('q') query?: string,
    @Query('remote') remote?: string,
  ) {
    const isRemote = remote === 'true' ? true : remote === 'false' ? false : undefined;
    return this.jobsService.searchJobs(query, isRemote);
  }

  @Get('aggregate')
  async aggregateJobs() {
    return this.jobsService.aggregateRemoteJobs();
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post()
  async createJob(@Body() createJobDto: any) {
    return this.jobsService.createJob(createJobDto);
  }
}
