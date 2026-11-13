import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CareerDomain, ProfessionalStatus, QualificationCompleted } from '../types';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  X, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, resetPassword, registerUser, setActivePage } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [currentStatus, setCurrentStatus] = useState<ProfessionalStatus>('College Student');
  const [highestQualificationCompleted, setHighestQualificationCompleted] = useState<QualificationCompleted | ''>('');
  const [careerDomain, setCareerDomain] = useState<CareerDomain>('Software and IT');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ loading: boolean; message: string; success: boolean } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName.trim() || !email.trim()) {
      setError('Please enter your full name and email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please create a password with at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        age: age ? Number(age) : undefined,
        currentStatus,
        highestQualificationCompleted: highestQualificationCompleted ? (highestQualificationCompleted as QualificationCompleted) : undefined,
        careerDomain,
      });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError('Google sign-in could not be completed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotStatus({ loading: true, message: '', success: false });
    const res = await resetPassword(forgotEmail);
    setForgotStatus({
      loading: false,
      message: res.message || 'Password reset link sent to your inbox.',
      success: res.success,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-white p-0.5 border border-[#E2E8F0] shadow-xs flex items-center justify-center">
            <img
              src="/assets/aistudio/Skill_Bridge_Learning_Emblem_c8344995.png"
              alt="Skill Bridge Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#111827]">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#64748B]">
            {mode === 'signin' 
              ? 'Log in to continue your career learning journey.' 
              : 'Join Skill Bridge to start your personalized roadmap.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              mode === 'signin'
                ? 'bg-white text-[#111827] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              mode === 'register'
                ? 'bg-white text-[#111827] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#111827] text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-xs"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-[#64748B]">or email</span>
            </div>
          </div>
        </div>

        {/* Forms */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#111827]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-medium text-[#2563EB] hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1.5">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 21"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111827] mb-1.5">
                  Current Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as any)}
                  className="w-full px-2.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
                >
                  <option value="School Student">School Student</option>
                  <option value="College Student">College Student</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Career Switcher">Career Switcher</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer text */}
        <p className="text-center text-xs text-[#64748B]">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>

      {/* Minimal Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E2E8F0] shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#111827]">Reset Password</h3>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotStatus(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            {forgotStatus?.message && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  forgotStatus.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {forgotStatus.message}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] focus:outline-hidden focus:border-[#2563EB]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotStatus(null);
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotStatus?.loading}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {forgotStatus?.loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
