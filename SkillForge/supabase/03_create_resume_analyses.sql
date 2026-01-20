-- Create resume_analyses table
-- Stores resume analysis results with ATS scores and feedback

CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    job_description TEXT,
    ats_score INTEGER CHECK (ats_score >= 0 AND ats_score <= 100),
    analysis_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS resume_analyses_user_id_idx ON public.resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS resume_analyses_created_at_idx ON public.resume_analyses(created_at DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.resume_analyses;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.resume_analyses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
