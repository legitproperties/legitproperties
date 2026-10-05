import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import {
  supabase,
  getCurrentAdminUser,
  adminSignIn,
  adminSignOut,
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
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure live session state - zero localStorage mock bypasses
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      if (!session?.user) {
        setAdmin(null);
        return;
      }
      const userProfile = await getCurrentAdminUser(session.user);
      if (userProfile && userProfile.email === 'goshened76@gmail.com') {
        setAdmin(userProfile);
      } else {
        await supabase?.auth.signOut();
        setAdmin(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Failed to reload admin profile:', err);
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

        if (initialSession?.user) {
          const email = (initialSession.user.email || '').trim().toLowerCase();
          if (email === 'goshened76@gmail.com') {
            const profile = await getCurrentAdminUser(initialSession.user);
            if (isMounted && profile) {
              setSession(initialSession);
              setAdmin(profile);
            }
          } else {
            // Unauthorized account: immediately purge session
            await supabase.auth.signOut();
            if (isMounted) {
              setSession(null);
              setAdmin(null);
            }
          }
        } else {
          if (isMounted) {
            setSession(null);
            setAdmin(null);
          }
        }
      } catch (e) {
        console.error('Error during initial session verification:', e);
        if (isMounted) {
          setSession(null);
          setAdmin(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen to real-time Supabase Auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;

        if (newSession?.user) {
          const email = (newSession.user.email || '').trim().toLowerCase();
          if (email === 'goshened76@gmail.com') {
            const profile = await getCurrentAdminUser(newSession.user);
            if (isMounted && profile) {
              setSession(newSession);
              setAdmin(profile);
            }
          } else {
            // Unauthorized email signed in - revoke immediately
            await supabase.auth.signOut();
            if (isMounted) {
              setSession(null);
              setAdmin(null);
            }
          }
        } else {
          // Signed out or session expired
          if (isMounted) {
            setAdmin(null);
            setSession(null);
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
      
      if (error || !verifiedAdmin || !newSession) {
        setSession(null);
        setAdmin(null);
        return { 
          success: false, 
          error: error || 'Authentication failed. Please check your credentials.', 
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

  const handleResetPassword = async (email: string) => {
    return await adminResetPassword(email);
  };

  const handleResendConfirmation = async (email: string) => {
    return await adminResendConfirmation(email);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await adminSignOut();
    } finally {
      setAdmin(null);
      setSession(null);
      setIsLoading(false);
    }
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
