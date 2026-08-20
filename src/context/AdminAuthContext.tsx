import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { supabase, getCurrentAdminUser, adminSignIn, adminSignUp, adminSignOut, isSupabaseConfigured } from '../lib/supabase';

interface AdminAuthContextType {
  admin: AdminUser | null;
  session: any | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const userProfile = await getCurrentAdminUser();
      setAdmin(userProfile);
    } catch (err) {
      console.error('Failed to load admin profile', err);
      setAdmin(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      setIsLoading(true);

      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          if (initialSession) {
            const profile = await getCurrentAdminUser();
            setAdmin(profile);
          } else {
            setAdmin(null);
          }
        }
      } catch (e) {
        console.error('Error during initial session check:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen to Supabase Auth State Changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        if (newSession?.user) {
          const profile = await getCurrentAdminUser();
          setAdmin(profile);
        } else {
          setAdmin(null);
        }
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { session: newSession, error } = await adminSignIn(email, password);
    if (error || !newSession) {
      setIsLoading(false);
      return { success: false, error: error || 'Authentication failed' };
    }

    setSession(newSession);
    const profile = await getCurrentAdminUser();
    setAdmin(profile);
    setIsLoading(false);
    return { success: true, error: null };
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const { user, error } = await adminSignUp(name, email, password);
    if (error || !user) {
      setIsLoading(false);
      return { success: false, error: error || 'Registration failed' };
    }

    // Auto sign in or load profile
    const profile = await getCurrentAdminUser();
    if (profile) {
      setAdmin(profile);
    }
    setIsLoading(false);
    return { success: true, error: null };
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await adminSignOut();
    setAdmin(null);
    setSession(null);
    setIsLoading(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
