-- Create user_activity table
-- Tracks user actions and analytics

CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS user_activity_user_id_idx ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS user_activity_created_at_idx ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS user_activity_type_idx ON public.user_activity(activity_type);
