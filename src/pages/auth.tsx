import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from '@/lib/firebase';

// ── Helpers ────────────────────────────────────────────────────────────
function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function validateEmail(v: string) {
  if (!v) return 'This field is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
  return '';
}

function validatePassword(v: string) {
  if (!v) return 'This field is required.';
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(v)) return 'Must include one uppercase letter and one number.';
  if (!/[0-9]/.test(v)) return 'Must include one uppercase letter and one number.';
  return '';
}

// ── Google Icon ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

// ── Password Input ─────────────────────────────────────────────────────
function PasswordInput({
  id, placeholder, value, onChange, error, valid,
}: {
  id: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string; valid?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pr-10 h-12 rounded-xl transition-all ${error ? 'border-red-500 focus-visible:ring-red-400' : valid ? 'border-emerald-500 focus-visible:ring-emerald-400' : 'focus-visible:ring-[#4f46e5]'}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {valid && !error && <CheckCircle2 size={14} className="text-emerald-500" />}
          <button type="button" onClick={() => setShow((s) => !s)}
            className="text-gray-400 hover:text-gray-600 transition-colors" aria-label={show ? 'Hide' : 'Show'}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Text Input with validation ─────────────────────────────────────────
function ValidatedInput({
  id, type = 'text', placeholder, value, onChange, error, valid,
}: {
  id: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string; valid?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 rounded-xl pr-9 transition-all ${error ? 'border-red-500 focus-visible:ring-red-400' : valid ? 'border-emerald-500 focus-visible:ring-emerald-400' : 'focus-visible:ring-[#4f46e5]'}`}
        />
        {valid && !error && (
          <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Login Form ─────────────────────────────────────────────────────────
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [globalErr, setGlobalErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = password ? '' : 'This field is required.';
    setEmailErr(eErr);
    setPasswordErr(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    setGlobalErr('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setGlobalErr(mapFirebaseError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGlobalErr('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setGlobalErr(mapFirebaseError(code));
      }
    }
  };

  const handleForgotPassword = async () => {
    const eErr = validateEmail(email);
    if (eErr) { setEmailErr('Enter your email above first.'); return; }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setGlobalErr('Could not send reset email. Check the address and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Google */}
      <Button type="button" variant="outline" onClick={handleGoogle}
        className="w-full gap-2 font-medium h-12 rounded-xl border-gray-200 hover:bg-gray-50">
        <GoogleIcon />
        Continue with Google
      </Button>
      {globalErr && <p className="text-xs text-red-600 text-center -mt-1">{globalErr}</p>}

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-400">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email Address</Label>
        <ValidatedInput id="login-email" type="email" placeholder="you@university.edu"
          value={email} onChange={(v) => { setEmail(v); if (emailErr) setEmailErr(validateEmail(v)); }}
          error={emailErr} valid={!!email && !emailErr && !validateEmail(email)} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
          <button type="button" onClick={handleForgotPassword} disabled={resetLoading}
            className="text-xs text-[#4f46e5] hover:underline font-medium flex items-center gap-1">
            {resetLoading && <Loader2 size={11} className="animate-spin" />}
            Forgot Password?
          </button>
        </div>
        <PasswordInput id="login-password" placeholder="Enter your password"
          value={password} onChange={(v) => { setPassword(v); if (passwordErr) setPasswordErr(v ? '' : 'This field is required.'); }}
          error={passwordErr} valid={!!password && !passwordErr} />
        {resetSent && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={12} /> Reset link sent to your email.
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading}
        className="w-full h-12 rounded-xl mt-1 font-semibold text-sm"
        style={{ background: '#2563EB' }}>
        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
        {loading ? 'Logging in…' : 'Log In'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        New here?{' '}
        <button type="button" onClick={onSwitch} className="text-[#4f46e5] font-semibold hover:underline">
          Sign Up
        </button>
      </p>
    </form>
  );
}

// ── Sign Up Form ───────────────────────────────────────────────────────
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const [globalErr, setGlobalErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validateName = (v: string) => {
    if (!v) return 'This field is required.';
    if (v.trim().length < 3) return 'Name must be at least 3 characters.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = confirm !== password ? 'Passwords do not match.' : confirm ? '' : 'This field is required.';
    setNameErr(nErr); setEmailErr(eErr); setPasswordErr(pErr); setConfirmErr(cErr);
    if (nErr || eErr || pErr || cErr) return;

    setLoading(true);
    setGlobalErr('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Save display name so it's available everywhere immediately
      await updateProfile(cred.user, { displayName: name.trim() });
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setGlobalErr(mapFirebaseError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGlobalErr('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setGlobalErr(mapFirebaseError(code));
      }
    }
  };

  // Password strength
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'][strength];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Google */}
      <Button type="button" variant="outline" onClick={handleGoogle}
        className="w-full gap-2 font-medium h-12 rounded-xl border-gray-200 hover:bg-gray-50">
        <GoogleIcon />
        Continue with Google
      </Button>
      {globalErr && <p className="text-xs text-red-600 text-center -mt-1">{globalErr}</p>}

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-400">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">Full Name</Label>
        <ValidatedInput id="signup-name" placeholder="Your full name"
          value={name} onChange={(v) => { setName(v); if (nameErr) setNameErr(validateName(v)); }}
          error={nameErr} valid={!!name && !nameErr && !validateName(name)} />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email Address</Label>
        <ValidatedInput id="signup-email" type="email" placeholder="you@university.edu"
          value={email} onChange={(v) => { setEmail(v); if (emailErr) setEmailErr(validateEmail(v)); }}
          error={emailErr} valid={!!email && !emailErr && !validateEmail(email)} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
        <PasswordInput id="signup-password" placeholder="Min 8 chars, 1 uppercase, 1 number"
          value={password} onChange={(v) => { setPassword(v); if (passwordErr) setPasswordErr(validatePassword(v)); }}
          error={passwordErr} valid={!!password && !validatePassword(password)} />
        {password && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500 w-10">{strengthLabel}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="signup-confirm" className="text-sm font-medium text-gray-700">Confirm Password</Label>
        <PasswordInput id="signup-confirm" placeholder="Repeat your password"
          value={confirm} onChange={(v) => { setConfirm(v); if (confirmErr) setConfirmErr(v !== password ? 'Passwords do not match.' : ''); }}
          error={confirmErr} valid={!!confirm && confirm === password} />
      </div>

      <Button type="submit" disabled={loading}
        className="w-full h-12 rounded-xl mt-1 font-semibold text-sm text-white"
        style={{ background: '#4f46e5' }}>
        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-[#4f46e5] font-semibold hover:underline">
          Log In
        </button>
      </p>
    </form>
  );
}

// ── Main Auth Page ─────────────────────────────────────────────────────
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const initialTab: 'login' | 'signup' =
    pathname === '/signup' || searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  // Auto-redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard', { replace: true });
    });
    return unsub;
  }, [navigate]);

  return (
    <>
      <title>{tab === 'login' ? 'Log In' : 'Sign Up'} — StudySync</title>
      <meta name="description" content="Log in or create your free StudySync account." />

      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: '#818cf8', transform: 'translate(-40%, -40%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: '#a78bfa', transform: 'translate(40%, 40%)' }} />

        {/* Back to home */}
        <div className="w-full max-w-[420px] mb-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>

        {/* Card */}
        <motion.div
          className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' as const }}
        >
          {/* Brand header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StudySync</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Study Smarter. Stay Consistent.</p>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-gray-100">
            {(['login', 'signup'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all relative ${tab === t ? 'text-[#4f46e5]' : 'text-gray-400 hover:text-gray-600'}`}>
                {t === 'login' ? 'Log In' : 'Sign Up'}
                {tab === t && (
                  <motion.div layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5]"
                    transition={{ duration: 0.25 }} />
                )}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="px-8 py-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -14 : 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'login' ? 14 : -14 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
              >
                {tab === 'login'
                  ? <LoginForm onSwitch={() => setTab('signup')} />
                  : <SignUpForm onSwitch={() => setTab('login')} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-gray-400">
              By continuing, you agree to our{' '}
              <span className="text-[#4f46e5] hover:underline cursor-pointer">Terms</span>{' '}
              and{' '}
              <span className="text-[#4f46e5] hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
