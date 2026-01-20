-- Run all database migrations in order
-- Execute this file in Supabase SQL Editor to set up the entire database

-- ⚠️ IMPORTANT: This database is already set up!
-- Only run this if you're creating a NEW Supabase project

-- Step 1: Enable extensions
\i 01_enable_extensions.sql

-- Step 2: Create profiles table with triggers
\i 02_create_profiles.sql

-- Step 3: Create resume analyses table
\i 03_create_resume_analyses.sql

-- Step 4: Create career roadmaps table
\i 04_create_career_roadmaps.sql

-- Step 5: Create user activity table
\i 05_create_user_activity.sql

-- Step 6: Set up Row Level Security policies
\i 06_create_rls_policies.sql

-- Step 7: Create helper functions
\i 07_create_helper_functions.sql

-- Step 8: (Optional) Add seed data for testing
-- \i 08_seed_data.sql

-- Step 9: Create interview results table
\i 09_create_interview_results.sql

-- Step 10: Create certificates table
\i 10_create_certificates.sql

-- Verify setup
SELECT 'Database setup complete!' AS status;

-- Show all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
