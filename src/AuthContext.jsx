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
  const getAccessToken = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.access_token || null;
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword, getAccessToken }),
    [user, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword, getAccessToken]
  );

  return (
    <AuthContext.Provider value={value}> 
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext); 
