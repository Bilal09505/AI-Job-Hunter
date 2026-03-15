import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  async createApplication(@Body() createApplicationDto: any) {
    return this.applicationsService.createApplication(createApplicationDto);
  }

  @Get('user/:userId')
  async getUserApplications(@Param('userId') userId: string) {
    return this.applicationsService.getUserApplications(userId);
  }

  @Get('stats/:userId')
  async getApplicationStats(@Param('userId') userId: string) {
    return this.applicationsService.getApplicationStats(userId);
  }

  @Patch(':id')
  async updateApplication(
    @Param('id') id: string,
    @Body() body: { userId: string; status: string; notes?: string },
  ) {
    return this.applicationsService.updateApplicationStatus(
      id,
      body.userId,
      body.status,
      body.notes,
    );
  }

  @Delete(':id')
  async deleteApplication(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.applicationsService.deleteApplication(id, body.userId);
  }
}
