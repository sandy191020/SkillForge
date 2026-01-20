-- Create interview_results table
-- Stores interview session results with scores and feedback

CREATE TABLE IF NOT EXISTS public.interview_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100) NOT NULL,
    questions JSONB,
    strengths TEXT[],
    weaknesses TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.interview_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own interview results"
    ON public.interview_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview results"
    ON public.interview_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview results"
    ON public.interview_results FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview results"
    ON public.interview_results FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS interview_results_user_id_idx ON public.interview_results(user_id);
CREATE INDEX IF NOT EXISTS interview_results_created_at_idx ON public.interview_results(created_at DESC);
CREATE INDEX IF NOT EXISTS interview_results_score_idx ON public.interview_results(score DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.interview_results;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.interview_results
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
