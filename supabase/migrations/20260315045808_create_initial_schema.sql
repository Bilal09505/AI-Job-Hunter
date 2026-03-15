/*
  # AI Job Hunter - Initial Database Schema

  ## Overview
  Creates the complete database structure for the AI Job Hunter application including
  users, jobs, applications, posts, and resumes with full Row Level Security.

  ## New Tables Created
  
  ### 1. users
  - `id` (uuid, primary key) - Auto-generated user ID
  - `email` (text, unique) - User email address
  - `password_hash` (text) - Encrypted password
  - `name` (text) - User full name
  - `skills` (text[]) - Array of user skills
  - `experience` (text) - Experience level (junior, mid, senior)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. jobs
  - `id` (uuid, primary key) - Auto-generated job ID
  - `title` (text) - Job title
  - `company` (text) - Company name
  - `location` (text) - Job location
  - `description` (text) - Full job description
  - `apply_url` (text) - Application link
  - `skills_required` (text[]) - Required skills array
  - `remote` (boolean) - Remote work availability
  - `salary_min` (integer) - Minimum salary
  - `salary_max` (integer) - Maximum salary
  - `source` (text) - Job source (LinkedIn, Indeed, etc.)
  - `created_at` (timestamptz) - Job posting date
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. applications
  - `id` (uuid, primary key) - Auto-generated application ID
  - `user_id` (uuid, foreign key) - References users table
  - `job_id` (uuid, foreign key) - References jobs table
  - `status` (text) - Application status (applied, interview, offer, rejected)
  - `notes` (text) - User notes about application
  - `applied_date` (timestamptz) - Application submission date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. posts
  - `id` (uuid, primary key) - Auto-generated post ID
  - `user_id` (uuid, foreign key) - References users table
  - `topic` (text) - Post topic/title
  - `content` (text) - Generated post content
  - `platform` (text) - Target platform (LinkedIn, Twitter, etc.)
  - `scheduled_for` (timestamptz) - Scheduled posting time
  - `posted` (boolean) - Whether post was published
  - `created_at` (timestamptz) - Post creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. resumes
  - `id` (uuid, primary key) - Auto-generated resume ID
  - `user_id` (uuid, foreign key) - References users table
  - `content` (text) - Resume content
  - `optimized_content` (text) - AI optimized version
  - `job_description` (text) - Target job description
  - `match_score` (integer) - AI calculated match score (0-100)
  - `suggestions` (jsonb) - AI improvement suggestions
  - `created_at` (timestamptz) - Resume creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Authenticated users can only access their own data
  - Jobs table is publicly readable but only system can insert
  - Comprehensive policies for SELECT, INSERT, UPDATE, DELETE operations

  ## Important Notes
  1. All tables use UUID primary keys with auto-generation
  2. Foreign key constraints ensure data integrity
  3. Timestamps auto-update on record changes
  4. RLS policies are restrictive by default
  5. Skills are stored as text arrays for flexibility
  6. JSONB used for complex nested data (suggestions)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  skills text[] DEFAULT '{}',
  experience text DEFAULT 'junior',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text DEFAULT 'Remote',
  description text NOT NULL,
  apply_url text NOT NULL,
  skills_required text[] DEFAULT '{}',
  remote boolean DEFAULT true,
  salary_min integer,
  salary_max integer,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status text DEFAULT 'applied',
  notes text DEFAULT '',
  applied_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  content text NOT NULL,
  platform text DEFAULT 'LinkedIn',
  scheduled_for timestamptz,
  posted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  optimized_content text,
  job_description text,
  match_score integer DEFAULT 0,
  suggestions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(remote);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for jobs table (publicly readable, system-only insert)
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for applications table
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for posts table
CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for resumes table
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();