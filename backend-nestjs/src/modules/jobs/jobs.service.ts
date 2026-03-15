import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

interface CreateJobDto {
  title: string;
  company: string;
  location?: string;
  description: string;
  applyUrl: string;
  skillsRequired?: string[];
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  source?: string;
}

@Injectable()
export class JobsService {
  constructor(private supabaseService: SupabaseService) {}

  async searchJobs(query?: string, remote?: boolean) {
    const supabase = this.supabaseService.getClient();

    let queryBuilder = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (remote !== undefined) {
      queryBuilder = queryBuilder.eq('remote', remote);
    }

    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to search jobs: ${error.message}`);
    }

    return data;
  }

  async getJobById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get job: ${error.message}`);
    }

    return data;
  }

  async createJob(createJobDto: CreateJobDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: createJobDto.title,
        company: createJobDto.company,
        location: createJobDto.location || 'Remote',
        description: createJobDto.description,
        apply_url: createJobDto.applyUrl,
        skills_required: createJobDto.skillsRequired || [],
        remote: createJobDto.remote ?? true,
        salary_min: createJobDto.salaryMin,
        salary_max: createJobDto.salaryMax,
        source: createJobDto.source || 'manual',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return data;
  }

  async aggregateRemoteJobs() {
    const mockJobs: CreateJobDto[] = [
      {
        title: 'Senior Angular Developer',
        company: 'TechCorp Inc',
        description: 'Looking for an experienced Angular developer to build enterprise applications. Must have 5+ years of experience with Angular, TypeScript, and RxJS.',
        applyUrl: 'https://example.com/jobs/1',
        skillsRequired: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
        remote: true,
        salaryMin: 100000,
        salaryMax: 150000,
        source: 'LinkedIn',
      },
      {
        title: 'Full Stack Developer (NestJS + Angular)',
        company: 'StartupHub',
        description: 'Join our growing team! We need a full-stack developer proficient in NestJS backend and Angular frontend.',
        applyUrl: 'https://example.com/jobs/2',
        skillsRequired: ['NestJS', 'Angular', 'PostgreSQL', 'Docker'],
        remote: true,
        salaryMin: 90000,
        salaryMax: 130000,
        source: 'Indeed',
      },
      {
        title: 'Backend Engineer - Node.js/NestJS',
        company: 'CloudSolutions',
        description: 'Build scalable microservices using NestJS. Experience with MongoDB and REST APIs required.',
        applyUrl: 'https://example.com/jobs/3',
        skillsRequired: ['NestJS', 'Node.js', 'MongoDB', 'REST API'],
        remote: true,
        salaryMin: 95000,
        salaryMax: 140000,
        source: 'LinkedIn',
      },
    ];

    const createdJobs = [];
    for (const job of mockJobs) {
      try {
        const created = await this.createJob(job);
        createdJobs.push(created);
      } catch (error) {
        console.error(`Failed to create job: ${job.title}`);
      }
    }

    return createdJobs;
  }
}
