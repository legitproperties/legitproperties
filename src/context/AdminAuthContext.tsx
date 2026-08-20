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
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('legit_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const userProfile = await getCurrentAdminUser();
      if (userProfile) {
        setAdmin(userProfile);
      }
    } catch (err) {
      console.error('Failed to load admin profile', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (!supabase) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          if (initialSession?.user) {
            const profile = await getCurrentAdminUser(initialSession.user);
            setAdmin(profile);
          } else {
            const stored = localStorage.getItem('legit_admin_user');
            if (!stored) {
              setAdmin(null);
            }
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
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        if (newSession?.user) {
          const profile = await getCurrentAdminUser(newSession.user);
          setAdmin(profile);
        } else if (event === 'SIGNED_OUT') {
          setAdmin(null);
          try {
            localStorage.removeItem('legit_admin_user');
          } catch {}
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
    const { session: newSession, user, error } = await adminSignIn(email, password);
    if (error || (!newSession && !user)) {
      setIsLoading(false);
      return { success: false, error: error || 'Authentication failed' };
    }

    setSession(newSession);
    const profile = await getCurrentAdminUser(user || newSession?.user);
    if (profile) {
      setAdmin(profile);
    }
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

    const profile = await getCurrentAdminUser(user);
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
    try {
      localStorage.removeItem('legit_admin_user');
    } catch {}
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
