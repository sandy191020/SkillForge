-- Row Level Security Policies
-- These policies ensure users can only access their own data

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Resume analyses policies
CREATE POLICY "Users can view their own resume analyses"
    ON public.resume_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume analyses"
    ON public.resume_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume analyses"
    ON public.resume_analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analyses"
    ON public.resume_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- Career roadmaps policies
CREATE POLICY "Users can view their own career roadmaps"
    ON public.career_roadmaps FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career roadmaps"
    ON public.career_roadmaps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career roadmaps"
    ON public.career_roadmaps FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own career roadmaps"
    ON public.career_roadmaps FOR DELETE
    USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view their own activity"
    ON public.user_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
    ON public.user_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);
