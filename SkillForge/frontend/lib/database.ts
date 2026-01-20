import { createClient } from './supabase/client';

// Resume Analysis Functions
export const saveResumeAnalysis = async (
  fileName: string,
  jobDescription: string,
  atsScore: number,
  analysisResult: any
) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('resume_analyses')
    .insert({
      user_id: user.id,
      file_name: fileName,
      job_description: jobDescription,
      ats_score: atsScore,
      analysis_result: analysisResult,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getResumeAnalyses = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteResumeAnalysis = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('resume_analyses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Career Roadmap Functions
export const saveCareerRoadmap = async (
  currentRole: string,
  targetRole: string,
  skills: string,
  roadmapData: any
) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('career_roadmaps')
    .insert({
      user_id: user.id,
      current_role: currentRole,
      target_role: targetRole,
      skills,
      roadmap_data: roadmapData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCareerRoadmaps = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('career_roadmaps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteCareerRoadmap = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('career_roadmaps')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// User Activity Tracking
export const trackActivity = async (activityType: string, metadata?: any) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return; // Don't throw error, just skip tracking

  await supabase
    .from('user_activity')
    .insert({
      user_id: user.id,
      activity_type: activityType,
      metadata,
    });
};

// Interview Results Functions
export const saveInterviewResult = async (
  role: string,
  score: number,
  questions: any[],
  strengths: string[],
  weaknesses: string[]
) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('interview_results')
    .insert({
      user_id: user.id,
      role,
      score,
      questions,
      strengths,
      weaknesses,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getInterviewResults = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('interview_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getInterviewResult = async (id: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('interview_results')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
};

// Certificate Functions
export const saveCertificate = async (
  interviewId: string,
  role: string,
  score: number,
  certificateData: any
) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: user.id,
      interview_id: interviewId,
      role,
      score,
      certificate_data: certificateData,
      minted: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCertificates = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getCertificate = async (id: string) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const mintCertificate = async (id: string, blockchainHash: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('certificates')
    .update({
      minted: true,
      blockchain_hash: blockchainHash,
      minted_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Profile Functions
export const getProfile = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const getUserName = async (): Promise<string | null> => {
  try {
    const profile = await getProfile();
    return profile?.full_name || null;
  } catch (error) {
    return null;
  }
};

export const updateProfile = async (updates: {
  full_name?: string;
  avatar_url?: string;
}) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
