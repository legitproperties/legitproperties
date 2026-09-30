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
  ArrowLeft
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminAuthPageProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onSuccess, onGoBack }) => {
  const { admin, signIn, signUp, isConfigured } = useAdminAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Automatically redirect if admin is already authenticated
  useEffect(() => {
    if (admin) {
      onSuccess();
    }
  }, [admin, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Please enter your administrator email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Please enter a password with at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const res = await signUp(name.trim() || 'Admin User', cleanEmail, password);
        setIsLoading(false);

        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed. Please check your credentials.');
        } else {
          setSuccessMsg('Administrator account registered and authorized! Opening Dashboard...');
          setTimeout(() => {
            onSuccess();
          }, 350);
        }
      } else {
        const res = await signIn(cleanEmail, password);
        setIsLoading(false);

        if (!res.success) {
          setErrorMsg(res.error || 'Invalid administrator credentials or unauthorized account.');
        } else {
          setSuccessMsg('Administrator verified! Opening Dashboard...');
          setTimeout(() => {
            onSuccess();
          }, 350);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Authentication error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none">
      
      {/* Subtle ambient lighting */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Top return bar */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>

          {/* Secure indicator without vendor text */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isConfigured ? 'Vault Online' : 'Local Mode'}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl mb-2 border border-slate-700">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Legit Properties Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs mx-auto">
            {authMode === 'signin'
              ? 'Sign in with your administrator credentials to access the management dashboard.'
              : 'Create a new authorized administrator profile linked to the cloud database.'}
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-5">
          
          {/* Sign In vs Sign Up Tabs Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 bg-red-950/60 border border-red-800/70 rounded-xl text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Success Notice */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/70 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (for Sign Up) */}
            {authMode === 'signup' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-300">
                  Full Name *
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
                    placeholder="Chief Admin"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            )}

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Administrator Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@legitproperties.com"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Password *
                </label>
                {authMode === 'signup' && (
                  <span className="text-[10px] text-slate-500">Min. 6 chars</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authMode === 'signin' ? 'Sign In to Dashboard' : 'Create Admin Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Encrypted session · Auto-redirects to /admin/dashboard</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
