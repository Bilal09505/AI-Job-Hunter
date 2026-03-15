import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    this.openai = new OpenAI({ apiKey });
  }

  async generateLinkedInPost(topic: string): Promise<string> {
    const prompt = `Generate a professional LinkedIn post about ${topic} for developers.
    The post should be:
    - Informative and valuable
    - Around 150-200 words
    - Include relevant hashtags
    - Engaging and conversational
    - Professional but not overly formal`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content creator specializing in developer-focused LinkedIn posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content.trim();
  }

  async generateCoverLetter(
    jobDescription: string,
    userProfile: { name: string; skills: string[]; experience: string },
  ): Promise<string> {
    const prompt = `Generate a professional cover letter for the following job description:

${jobDescription}

Candidate Profile:
Name: ${userProfile.name}
Skills: ${userProfile.skills.join(', ')}
Experience Level: ${userProfile.experience}

The cover letter should:
- Be tailored to the job description
- Highlight relevant skills
- Be professional and concise (250-300 words)
- Show enthusiasm for the role`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and cover letter writer.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0].message.content.trim();
  }

  async optimizeResume(
    resumeContent: string,
    jobDescription: string,
  ): Promise<{ optimizedContent: string; suggestions: string[] }> {
    const prompt = `Analyze this resume against the job description and provide optimization suggestions:

Resume:
${resumeContent}

Job Description:
${jobDescription}

Provide:
1. Specific suggestions to improve the resume
2. Keywords to add
3. Skills to highlight
4. Format improvements`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and career coach specializing in tech roles.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content.trim();
    const suggestions = response.split('\n').filter((s) => s.trim().length > 0);

    return {
      optimizedContent: response,
      suggestions,
    };
  }

  async analyzeSkillMatch(
    userSkills: string[],
    jobDescription: string,
  ): Promise<{
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  }> {
    const prompt = `Analyze the skill match between the candidate and job description:

Candidate Skills: ${userSkills.join(', ')}

Job Description:
${jobDescription}

Provide:
1. Match score (0-100)
2. Matched skills
3. Missing skills
4. Recommendations to improve match

Format your response as JSON with keys: matchScore, matchedSkills, missingSkills, recommendations`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter and skills analyst.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    try {
      const response = completion.choices[0].message.content.trim();
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        matchScore: 50,
        matchedSkills: [],
        missingSkills: [],
        recommendations: ['Unable to parse AI response. Please try again.'],
      };
    } catch (error) {
      return {
        matchScore: 0,
        matchedSkills: [],
        missingSkills: [],
        recommendations: ['Error analyzing skills. Please try again.'],
      };
    }
  }
}
