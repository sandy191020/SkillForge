-- Create career_roadmaps table
-- Stores generated career roadmaps with phases and milestones

CREATE TABLE IF NOT EXISTS public.career_roadmaps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    "current_role" TEXT NOT NULL,
    "target_role" TEXT NOT NULL,
    skills TEXT,
    roadmap_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS career_roadmaps_user_id_idx ON public.career_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS career_roadmaps_created_at_idx ON public.career_roadmaps(created_at DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.career_roadmaps;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.career_roadmaps
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
