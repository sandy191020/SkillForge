-- Optional seed data for testing
-- This is for development/testing purposes only

-- Note: This assumes you have a test user created
-- Replace 'YOUR_TEST_USER_ID' with an actual user ID from auth.users

-- Example resume analysis (uncomment and update user_id to use)
/*
INSERT INTO public.resume_analyses (user_id, file_name, job_description, ats_score, analysis_result)
VALUES (
    'YOUR_TEST_USER_ID',
    'sample_resume.pdf',
    'Looking for a Senior Software Engineer with 5+ years of experience in React and Node.js',
    85,
    '{
        "strengths": ["Strong technical skills", "Good project experience"],
        "improvements": ["Add more quantifiable achievements", "Include relevant certifications"],
        "keywords_matched": ["React", "Node.js", "JavaScript"],
        "keywords_missing": ["TypeScript", "AWS", "Docker"]
    }'::jsonb
);
*/

-- Example career roadmap (uncomment and update user_id to use)
/*
INSERT INTO public.career_roadmaps (user_id, current_role, target_role, skills, roadmap_data)
VALUES (
    'YOUR_TEST_USER_ID',
    'Junior Developer',
    'Senior Software Engineer',
    'JavaScript, React, Node.js',
    '{
        "phases": [
            {
                "title": "Foundation Building",
                "duration": "3 months",
                "milestones": ["Master JavaScript fundamentals", "Build 3 portfolio projects"]
            },
            {
                "title": "Advanced Skills",
                "duration": "6 months",
                "milestones": ["Learn system design", "Contribute to open source"]
            }
        ]
    }'::jsonb
);
*/

-- Example user activity (uncomment and update user_id to use)
/*
INSERT INTO public.user_activity (user_id, activity_type, metadata)
VALUES 
    ('YOUR_TEST_USER_ID', 'resume_upload', '{"file_name": "resume.pdf"}'::jsonb),
    ('YOUR_TEST_USER_ID', 'roadmap_generated', '{"target_role": "Senior Engineer"}'::jsonb),
    ('YOUR_TEST_USER_ID', 'profile_updated', '{"field": "avatar_url"}'::jsonb);
*/
