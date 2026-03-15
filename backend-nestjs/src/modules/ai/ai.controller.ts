import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('post')
  async generatePost(@Body() body: { topic: string }) {
    const content = await this.aiService.generateLinkedInPost(body.topic);
    return { content };
  }

  @Post('cover-letter')
  async generateCoverLetter(
    @Body() body: { jobDescription: string; userProfile: any },
  ) {
    const content = await this.aiService.generateCoverLetter(
      body.jobDescription,
      body.userProfile,
    );
    return { content };
  }

  @Post('resume-optimize')
  async optimizeResume(
    @Body() body: { resumeContent: string; jobDescription: string },
  ) {
    const result = await this.aiService.optimizeResume(
      body.resumeContent,
      body.jobDescription,
    );
    return result;
  }

  @Post('skill-match')
  async analyzeSkillMatch(
    @Body() body: { userSkills: string[]; jobDescription: string },
  ) {
    const result = await this.aiService.analyzeSkillMatch(
      body.userSkills,
      body.jobDescription,
    );
    return result;
  }
}
