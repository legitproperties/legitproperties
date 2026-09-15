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
  Settings,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { setCustomSupabaseConfig, resetSupabaseConfig } from '../../lib/supabase';

interface AdminAuthPageProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

type AuthMode = 'signin' | 'register';

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onSuccess, onGoBack }) => {
  const {
    admin,
    signIn,
    signUp,
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Supabase Settings Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(supabaseUrl || '');
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Automatically redirect if admin is already authenticated
  useEffect(() => {
    if (admin) {
      onSuccess();
    }
  }, [admin, onSuccess]);

  const handleTabSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your admin email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      const cleanName = name.trim();
      if (!cleanName) {
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
      const res = await signUp(cleanName, cleanEmail, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Admin registration failed. Please try again.');
      } else {
        setSuccessMsg('Admin account registered successfully! Opening Dashboard...');
        setTimeout(() => {
          onSuccess();
        }, 400);
      }
    } else {
      // Sign In mode
      setIsLoading(true);
      const res = await signIn(cleanEmail, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials or unauthorized account.');
      } else {
        setSuccessMsg('Admin authentication verified! Opening Dashboard...');
        setTimeout(() => {
          onSuccess();
        }, 300);
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
    setIsConfigModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background ambient accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#167A5A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Navigation & database status bar */}
        <div className="mb-6 flex justify-between items-center px-4 sm:px-0">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>

          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
            title="Configure Database Connection"
            type="button"
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
            Legit Properties Admin
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {mode === 'signin' ? 'Sign in with your administrator credentials' : 'Register a new administrator account'}
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          {/* Two-Tab Switcher: Sign In vs Register Only */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-700/70 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleTabSwitch('signin')}
              className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#167A5A] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#167A5A] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Register
            </button>
          </div>

          {/* Error Diagnostics Alert */}
          {errorMsg && (
            <div className="p-4 bg-red-950/70 border border-red-800/80 rounded-2xl text-red-200 text-xs space-y-1 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {errorMsg}
                </div>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {successMsg && (
            <div className="p-4 bg-emerald-950/70 border border-emerald-800/80 rounded-2xl text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field (Register only) */}
            {mode === 'register' && (
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

            {/* Admin Email field (Both modes) */}
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

            {/* Password field (Both modes) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 6 characters' : '••••••••'}
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

            {/* Confirm Password field (Register only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-1 focus:ring-[#167A5A] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 bg-[#167A5A] hover:bg-[#13684d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' ? 'Sign In to Admin Portal' : 'Register Admin Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher Helper */}
          <div className="pt-3 border-t border-slate-700/60 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-400">
                Need an administrator account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already registered as an admin?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signin')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Database Connection & Supabase Settings Modal */}
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
                type="button"
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
                      onClick={() => {
                        resetSupabaseConfig();
                        setIsConfigModalOpen(false);
                      }}
                      className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

              <div className="p-3 bg-slate-900/50 rounded-xl text-[11px] text-slate-400 space-y-1">
                <strong className="text-slate-300">Tip for Instant Admin Login:</strong>
                <p>
                  To allow instant sign-ins without requiring email confirmation links, open your Supabase Dashboard → <strong>Authentication</strong> → <strong>Providers</strong> → <strong>Email</strong> → toggle <strong>Confirm email</strong> to OFF.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
