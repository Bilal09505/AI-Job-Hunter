import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

interface CreateApplicationDto {
  userId: string;
  jobId: string;
  status?: string;
  notes?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(private supabaseService: SupabaseService) {}

  async createApplication(createApplicationDto: CreateApplicationDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: createApplicationDto.userId,
        job_id: createApplicationDto.jobId,
        status: createApplicationDto.status || 'applied',
        notes: createApplicationDto.notes || '',
      })
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          apply_url
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create application: ${error.message}`);
    }

    return data;
  }

  async getUserApplications(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          apply_url,
          description
        )
      `)
      .eq('user_id', userId)
      .order('applied_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to get applications: ${error.message}`);
    }

    return data;
  }

  async updateApplicationStatus(
    applicationId: string,
    userId: string,
    status: string,
    notes?: string,
  ) {
    const supabase = this.supabaseService.getClient();

    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .eq('user_id', userId)
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          apply_url
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    return data;
  }

  async deleteApplication(applicationId: string, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete application: ${error.message}`);
    }

    return { message: 'Application deleted successfully' };
  }

  async getApplicationStats(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to get application stats: ${error.message}`);
    }

    const stats = {
      total: data.length,
      applied: data.filter((app) => app.status === 'applied').length,
      interview: data.filter((app) => app.status === 'interview').length,
      offer: data.filter((app) => app.status === 'offer').length,
      rejected: data.filter((app) => app.status === 'rejected').length,
    };

    return stats;
  }
}
