import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
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
  const { admin, signIn, isConfigured } = useAdminAuth();

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

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn(cleanEmail, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials or unauthorized administrator account.');
      } else {
        setSuccessMsg('Administrator verified! Opening Dashboard...');
        setTimeout(() => {
          onSuccess();
        }, 300);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Authentication error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#167A5A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Top bar with return button and live connection indicator */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            type="button"
            id="return-to-site-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>

          {/* Discreet connection indicator - no vendor branding */}
          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300"
            title="Secure cloud database sync active"
            id="system-status-indicator"
          >
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isConfigured ? 'System Online' : 'Local Mode'}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#167A5A] to-[#105941] text-white shadow-lg shadow-emerald-950/60 mb-2 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs mx-auto">
            Sign in with your administrator credentials to access the management dashboard.
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-5">
          {/* Error Notice */}
          {errorMsg && (
            <div 
              className="p-4 bg-red-950/60 border border-red-800/70 rounded-2xl text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
              id="admin-auth-error"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {errorMsg}
              </div>
            </div>
          )}

          {/* Success Notice */}
          {successMsg && (
            <div 
              className="p-4 bg-emerald-950/60 border border-emerald-800/70 rounded-2xl text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
              id="admin-auth-success"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Pure Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="admin-signin-form">
            {/* Admin Email field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-semibold text-slate-300"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@legitproperties.com"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-2 focus:ring-[#167A5A]/20 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="admin-password" 
                  className="block text-xs font-semibold text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#167A5A] focus:ring-2 focus:ring-[#167A5A]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="toggle-password-visibility-btn"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              id="admin-signin-submit-btn"
              className="w-full mt-3 py-3.5 px-4 bg-[#167A5A] hover:bg-[#13684d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice - strictly no registration links or external brand names */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Authorized personnel only. Public registration is disabled.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
