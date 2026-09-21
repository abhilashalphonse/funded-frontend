// src/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => { 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions on initial load
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth functions
  // Modify this line inside your AuthContext.jsx to capture the extra user data
const signUp = useCallback((email, password, metadata) => {
  const emailRedirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : undefined;

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo,
    },
  });
}, []);
  const signIn = useCallback((email, password) => supabase.auth.signInWithPassword({ email, password }), []);
  const resendSignupVerification = useCallback((email) => {
    const emailRedirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

    return supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo },
    });
  }, []);
  const signInWithGoogle = useCallback(() =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    }), []);
  const signOut = useCallback(() => supabase.auth.signOut(), []);
  const resetPassword = useCallback((email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    }), []);
  const getAccessToken = useCallback(async ({ forceRefresh = false } = {}) => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return null;

    const expiresAtMs = Number(session.expires_at || 0) * 1000;
    const expiresSoon = expiresAtMs > 0 && expiresAtMs - Date.now() <= 60_000;
    if (!forceRefresh && session.access_token && !expiresSoon) {
      return session.access_token;
    }

    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) throw refreshError;
    return refreshedSession?.access_token || null;
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signInWithGoogle, resendSignupVerification, signOut, resetPassword, getAccessToken }),
    [user, loading, signUp, signIn, signInWithGoogle, resendSignupVerification, signOut, resetPassword, getAccessToken]
  );

  return (
    <AuthContext.Provider value={value}> 
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext); 
