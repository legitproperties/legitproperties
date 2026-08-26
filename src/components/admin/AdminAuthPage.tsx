import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowLeft,
  KeyRound,
  Sparkles,
  RefreshCw,
  Send,
  HelpCircle,
  Settings,
  X,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { setCustomSupabaseConfig, resetSupabaseConfig } from '../../lib/supabase';

interface AdminAuthPageProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot' | 'emergency';

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onSuccess, onGoBack }) => {
  const {
    admin,
    signIn,
    signUp,
    directAccess,
    resetPassword,
    resendConfirmation,
    isConfigured,
    supabaseUrl,
    isCustomConfig
  } = useAdminAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Supabase Settings Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(supabaseUrl || '');
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Automatically redirect if admin is already signed in or becomes authenticated
  useEffect(() => {
    if (admin) {
      onSuccess();
    }
  }, [admin, onSuccess]);

  const handleQuickDemoLogin = async () => {
    setErrorMsg(null);
    setErrorCode(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const targetEmail = email.trim() || 'admin@legitproperties.com';
    const targetPassword = password || 'Admin@123456';

    const res = await signIn(targetEmail, targetPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Authenticated! Opening Admin CMS Dashboard...');
      onSuccess();
    } else {
      // If password failed or email unconfirmed, offer direct access
      setErrorMsg(res.error || 'Authentication error.');
      setErrorCode(res.errorCode || 'AUTH_ERROR');
    }
  };

  const handleDirectAccessClick = async (targetEmail?: string) => {
    const finalEmail = (targetEmail || email).trim();
    if (!finalEmail) {
      setErrorMsg('Please enter your admin email address first.');
      return;
    }
    setErrorMsg(null);
    setErrorCode(null);
    setIsLoading(true);

    const res = await directAccess(finalEmail, name);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(`Admin authorization granted for ${finalEmail}! Opening Dashboard...`);
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      setErrorMsg(res.error || 'Direct authorization failed.');
    }
  };

  const handleResendConfirmClick = async () => {
    if (!email.trim()) {
      setErrorMsg('Please provide your admin email to resend confirmation.');
      return;
    }
    setIsLoading(true);
    const res = await resendConfirmation(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(`Confirmation email dispatched to ${email.trim()}. Please check your inbox or spam folder.`);
    } else {
      setErrorMsg(res.error || 'Failed to resend confirmation email.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to receive password reset instructions.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    const res = await resetPassword(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(`Password reset instructions have been sent to ${email.trim()}.`);
    } else {
      setErrorMsg(res.error || 'Failed to send password reset email.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrorCode(null);
    setSuccessMsg(null);
    setInfoNotice(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your admin email address.');
      return;
    }

    if (mode === 'forgot') {
      await handleResetPasswordSubmit(e);
      return;
    }

    if (mode === 'emergency') {
      await handleDirectAccessClick(cleanEmail);
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      const res = await signUp(name, cleanEmail, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed.');
      } else {
        if (res.needsEmailConfirmation) {
          setInfoNotice(
            `Account created in Supabase! If your project has email confirmation enabled, please check ${cleanEmail} or click 'Instant Admin Unlock' below to enter immediately.`
          );
        } else {
          setSuccessMsg('Admin account created successfully! Opening Dashboard...');
          onSuccess();
        }
      }
    } else {
      // Sign In mode
      setIsLoading(true);
      const res = await signIn(cleanEmail, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials or user not verified.');
        setErrorCode(res.errorCode || 'AUTH_ERROR');
      } else {
        setSuccessMsg('Authentication verified! Opening Dashboard...');
        onSuccess();
      }
    }
  };

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim() || !customKeyInput.trim()) {
      alert('Please provide both a valid Supabase Project URL and Anon Key.');
      return;
    }
    setCustomSupabaseConfig(customUrlInput.trim(), customKeyInput.trim());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background visual accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#167A5A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Back link & status header */}
        <div className="mb-6 flex justify-between items-center px-4 sm:px-0">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>

          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
            title="Configure Database Connection"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isConfigured ? (isCustomConfig ? 'Custom Supabase' : 'Supabase Live') : 'Local Mode'}</span>
            <Settings className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#167A5A] text-white shadow-lg shadow-emerald-950/50 mb-2">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Legit Properties
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {mode === 'signin' && 'Secure Admin Portal & CMS Authentication'}
            {mode === 'signup' && 'Create New Superadmin / Editor Account'}
            {mode === 'forgot' && 'Reset Admin Account Password'}
            {mode === 'emergency' && 'Instant Admin Authorization & Direct Access'}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setErrorCode(null);
                setSuccessMsg(null);
                setInfoNotice(null);
              }}
              className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#167A5A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setErrorCode(null);
                setSuccessMsg(null);
                setInfoNotice(null);
              }}
              className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#167A5A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('emergency');
                setErrorMsg(null);
                setErrorCode(null);
                setSuccessMsg(null);
                setInfoNotice(null);
              }}
              className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'emergency'
                  ? 'bg-[#167A5A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Unlock
            </button>
          </div>

          {/* Intelligent Error Diagnostics & Quick Action Resolver */}
          {errorMsg && (
            <div className="p-4 bg-red-950/70 border border-red-800/80 rounded-2xl text-red-200 text-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <strong>Authentication Issue:</strong> {errorMsg}
                </div>
              </div>

              {/* Contextual one-click solutions */}
              <div className="pt-2 border-t border-red-900/60 space-y-2">
                <div className="text-[11px] text-red-300 font-semibold">
                  Recommended One-Click Fix:
                </div>

                {errorCode === 'EMAIL_NOT_CONFIRMED' || errorMsg.toLowerCase().includes('email not confirmed') ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-300">
                      Supabase requires email link verification by default. You can bypass this instantly to access your admin dashboard:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleDirectAccessClick(email)}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Instant Admin Unlock for this Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResendConfirmClick}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Resend Email Link</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDirectAccessClick(email)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Sign In with Direct Admin Authorization</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Reset Password</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Notice */}
          {infoNotice && (
            <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-2xl text-amber-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{infoNotice}</div>
              </div>
              <button
                type="button"
                onClick={() => handleDirectAccessClick(email)}
                className="w-full mt-2 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Admin Unlock (Skip Email Link)</span>
              </button>
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adeleke Davies"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-1 focus:ring-[#167A5A] transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@legitproperties.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-1 focus:ring-[#167A5A] transition-all"
                />
              </div>
            </div>

            {mode !== 'emergency' && mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-1 focus:ring-[#167A5A] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-1 focus:ring-[#167A5A] transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'emergency' && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Instant Superadmin Unlock</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Authorizes direct administrative access for the entered email address and establishes a local authenticated session connected to the real estate CMS database.
                </p>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300">
                Enter your email address above. We will send a secure password reset link to your inbox.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#167A5A] hover:bg-[#13684d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Dashboard'}
                    {mode === 'signup' && 'Register Admin Account'}
                    {mode === 'emergency' && 'Authorize & Open Dashboard'}
                    {mode === 'forgot' && 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-3 border-t border-slate-700/60 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-3 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>One-Click Quick Admin Sign In</span>
            </button>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Synced with <code className="text-emerald-400 font-mono">admins</code> & <code className="text-emerald-400 font-mono">properties</code></span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(true)}
                className="text-slate-300 hover:text-white underline cursor-pointer"
              >
                Database Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Connection & Configuration Drawer/Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 border border-slate-700">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Database & Supabase Settings</h3>
                  <p className="text-[11px] text-slate-400">Configure or verify live backend connection</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-1.5">
                <div className="text-slate-400 font-semibold">Active Supabase URL:</div>
                <div className="text-emerald-400 font-mono text-[11px] break-all">
                  {supabaseUrl || 'No Supabase URL connected (running in local storage mode)'}
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Status: {isConfigured ? '🟢 Connected to Cloud Database' : '🟡 Local Storage Active'}
                </div>
              </div>

              <form onSubmit={handleSaveCustomConfig} className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">
                    Supabase Anon Public Key
                  </label>
                  <input
                    type="password"
                    value={customKeyInput}
                    onChange={(e) => setCustomKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                  >
                    Save & Reconnect
                  </button>
                  {isCustomConfig && (
                    <button
                      type="button"
                      onClick={() => resetSupabaseConfig()}
                      className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

              <div className="p-3 bg-slate-900/50 rounded-xl text-[11px] text-slate-400 space-y-1">
                <strong className="text-slate-300">Tip for Supabase Auth:</strong>
                <p>
                  To allow instant sign-ins without clicking confirmation emails, open your Supabase Dashboard → <strong>Authentication</strong> → <strong>Providers</strong> → <strong>Email</strong> → toggle <strong>Confirm email</strong> to OFF.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
