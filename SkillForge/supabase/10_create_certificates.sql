-- Create certificates table
-- Stores generated certificates with blockchain minting status

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    interview_id UUID REFERENCES public.interview_results(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100) NOT NULL,
    certificate_data JSONB,
    minted BOOLEAN DEFAULT FALSE,
    blockchain_hash TEXT,
    minted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own certificates"
    ON public.certificates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
    ON public.certificates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates"
    ON public.certificates FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certificates"
    ON public.certificates FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS certificates_user_id_idx ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS certificates_interview_id_idx ON public.certificates(interview_id);
CREATE INDEX IF NOT EXISTS certificates_created_at_idx ON public.certificates(created_at DESC);
CREATE INDEX IF NOT EXISTS certificates_minted_idx ON public.certificates(minted);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.certificates;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.certificates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
