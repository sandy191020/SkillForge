# Supabase Database Setup

## Important Note

⚠️ **The database is already set up!** 

SkillForge uses the same Supabase project as AI_Resume_Analyzer:
- **URL**: https://zjvrtonyztmejsazhzbe.supabase.co
- **Database**: Already configured with all tables and policies

You don't need to run these SQL files unless you're setting up a new Supabase project.

## Database Schema

The following tables are already created:

1. **profiles** - User profile information
2. **resume_analyses** - Stores resume analysis results
3. **career_roadmaps** - Stores generated career roadmaps
4. **user_activity** - Tracks user actions and analytics

## Files in This Directory

- `01_enable_extensions.sql` - Enable required PostgreSQL extensions
- `02_create_profiles.sql` - User profiles table
- `03_create_resume_analyses.sql` - Resume analyses table
- `04_create_career_roadmaps.sql` - Career roadmaps table
- `05_create_user_activity.sql` - User activity tracking table
- `06_create_rls_policies.sql` - Row Level Security policies
- `07_create_helper_functions.sql` - Database helper functions
- `08_seed_data.sql` - Optional seed data for testing
- `00_run_all.sql` - Run all migrations in order

## If You Need to Set Up a New Project

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run `00_run_all.sql` or run each file individually in order
4. Update `.env.local` with your new project credentials

## Current Setup

Since the database is already configured, you can:
- ✅ Start using auth functions immediately
- ✅ Save resume analyses
- ✅ Store career roadmaps
- ✅ Track user activity
- ✅ All RLS policies are active

## Verifying the Setup

To verify the database is working:

```typescript
import { getCurrentUser } from '@/lib/auth';
import { getProfile } from '@/lib/database';

// Check if user can authenticate
const user = await getCurrentUser();

// Check if profile exists
const profile = await getProfile();
```

## Shared Database

Both SkillForge and AI_Resume_Analyzer use the same database, so:
- Users created in one app can log into the other
- Data is shared between both applications
- Any changes to the database affect both apps
