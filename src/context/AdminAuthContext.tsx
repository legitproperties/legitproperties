import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import {
  supabase,
  getCurrentAdminUser,
  adminSignIn,
  adminSignUp,
  adminSignOut,
  adminDirectAccess,
  adminResetPassword,
  adminResendConfirmation,
  isSupabaseConfigured,
  activeSupabaseConfig
} from '../lib/supabase';

interface AdminAuthContextType {
  admin: AdminUser | null;
  session: any | null;
  isLoading: boolean;
  isConfigured: boolean;
  supabaseUrl: string;
  isCustomConfig: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null; errorCode?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error: string | null; needsEmailConfirmation?: boolean }>;
  directAccess: (email: string, name?: string) => Promise<{ success: boolean; error: string | null }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error: string | null }>;
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
        const { data: { session: initialSession }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.warn('Initial session check notice:', sessionErr.message);
        }

        if (isMounted) {
          setSession(initialSession);
          if (initialSession?.user) {
            const profile = await getCurrentAdminUser(initialSession.user);
            if (isMounted) {
              setAdmin(profile);
            }
          } else {
            if (isMounted) {
              setAdmin(null);
              try {
                localStorage.removeItem('legit_admin_user');
              } catch {}
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
          if (isMounted) {
            setAdmin(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setAdmin(null);
            setSession(null);
            try {
              localStorage.removeItem('legit_admin_user');
            } catch {}
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
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
    try {
      const { session: newSession, user: verifiedAdmin, error, errorCode } = await adminSignIn(email, password);
      if (error || !verifiedAdmin) {
        setSession(null);
        setAdmin(null);
        return { 
          success: false, 
          error: error || 'Authentication failed: Account not authorized in admins table.', 
          errorCode 
        };
      }

      setSession(newSession);
      setAdmin(verifiedAdmin);
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error in handleSignIn:', err);
      return { 
        success: false, 
        error: err?.message || 'Login failed unexpectedly.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const { user, error, needsEmailConfirmation } = await adminSignUp(name, email, password);
    if (error || !user) {
      setIsLoading(false);
      return { success: false, error: error || 'Registration failed' };
    }

    const profile = await getCurrentAdminUser(user);
    if (profile) {
      setAdmin(profile);
    }
    setIsLoading(false);
    return { success: true, error: null, needsEmailConfirmation };
  };

  const handleDirectAccess = async (email: string, name?: string) => {
    setIsLoading(true);
    const { user, error } = await adminDirectAccess(email, name);
    if (error || !user) {
      setIsLoading(false);
      return { success: false, error: error || 'Direct access authorization failed' };
    }
    setAdmin(user);
    setIsLoading(false);
    return { success: true, error: null };
  };

  const handleResetPassword = async (email: string) => {
    return await adminResetPassword(email);
  };

  const handleResendConfirmation = async (email: string) => {
    return await adminResendConfirmation(email);
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
        supabaseUrl: activeSupabaseConfig.url,
        isCustomConfig: activeSupabaseConfig.isCustom,
        signIn: handleSignIn,
        signUp: handleSignUp,
        directAccess: handleDirectAccess,
        resetPassword: handleResetPassword,
        resendConfirmation: handleResendConfirmation,
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
