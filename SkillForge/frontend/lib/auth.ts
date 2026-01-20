import { createClient } from './supabase/client';

// Get current user
export const getCurrentUser = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// Get user email
export const getUserEmail = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.email || null;
};

// Get user name
export const getUserName = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.user_metadata?.full_name || null;
};

// Sign up new user
export const signUp = async (email: string, password: string, fullName: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  if (error) throw error;
  return data;
};

// Sign in user
export const signIn = async (email: string, password: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Sign out user
export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
};

// Sign in with OAuth provider
export const signInWithProvider = async (provider: 'google' | 'github') => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
};
