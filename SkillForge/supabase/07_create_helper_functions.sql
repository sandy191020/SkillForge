-- Helper functions for common database operations

-- Function to get user's resume analysis count
CREATE OR REPLACE FUNCTION public.get_user_resume_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM public.resume_analyses
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's roadmap count
CREATE OR REPLACE FUNCTION public.get_user_roadmap_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM public.career_roadmaps
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's latest activity
CREATE OR REPLACE FUNCTION public.get_user_latest_activity(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    activity_type TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ua.id,
        ua.activity_type,
        ua.metadata,
        ua.created_at
    FROM public.user_activity ua
    WHERE ua.user_id = user_uuid
    ORDER BY ua.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'resume_count', (SELECT COUNT(*) FROM public.resume_analyses WHERE user_id = user_uuid),
        'roadmap_count', (SELECT COUNT(*) FROM public.career_roadmaps WHERE user_id = user_uuid),
        'activity_count', (SELECT COUNT(*) FROM public.user_activity WHERE user_id = user_uuid),
        'avg_ats_score', (SELECT COALESCE(AVG(ats_score), 0) FROM public.resume_analyses WHERE user_id = user_uuid),
        'last_activity', (SELECT MAX(created_at) FROM public.user_activity WHERE user_id = user_uuid)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
