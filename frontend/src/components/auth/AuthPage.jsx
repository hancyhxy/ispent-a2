import { useState } from 'react';

// Email-first auth flow (Google / Notion style):
//   Step 1: enter email → backend tells us if it exists
//   Step 2a (exists):  ask for password → sign in
//   Step 2b (!exists): ask for name + password → create account
export default function AuthPage({ onCheckEmail, onLogin, onRegister }) {
  const [step, setStep] = useState('email'); // 'email' | 'login' | 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetToEmail = () => {
    setStep('email');
    setPassword('');
    setName('');
  };

  const handleEmailContinue = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const exists = await onCheckEmail(email);
    setSubmitting(false);
    if (exists === null) return; // network error, toast already shown
    setStep(exists ? 'login' : 'register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onLogin(email, password);
    if (!ok) setSubmitting(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onRegister(name, email, password);
    if (!ok) setSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm ' +
    'text-text-primary focus:outline-none focus:border-primary';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/favicon.svg" alt="iSpent logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-primary">iSpent</span>
          </div>
          <p className="text-sm text-text-muted">
            Keep tracking — log it in seconds, stay on track.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl p-8 shadow-sm">

          {/* ── Step 1 · Email ───────────────────────────── */}
          {step === 'email' && (
            <>
              <h1 className="text-lg font-semibold text-text-primary mb-1">
                Sign in or create account
              </h1>
              <p className="text-sm text-text-muted mb-6">
                Enter your email to continue
              </p>
              <form onSubmit={handleEmailContinue} className="flex flex-col gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-text-secondary mb-1.5 block">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-light
                    text-white text-sm font-semibold transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Checking…' : 'Continue'}
                </button>
              </form>
            </>
          )}

          {/* ── Step 2a · Login (email exists) ───────────── */}
          {step === 'login' && (
            <>
              <h1 className="text-lg font-semibold text-text-primary mb-1">Welcome back</h1>
              <p className="text-sm text-text-muted mb-6">
                Signing in as <span className="text-text-secondary font-medium">{email}</span>
              </p>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-text-secondary mb-1.5 block">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    placeholder="Your password"
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-light
                    text-white text-sm font-semibold transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
              <button
                onClick={resetToEmail}
                className="mt-6 text-center w-full text-sm text-text-muted hover:text-text-secondary"
              >
                ← Use a different email
              </button>
            </>
          )}

          {/* ── Step 2b · Register (email is new) ────────── */}
          {step === 'register' && (
            <>
              <h1 className="text-lg font-semibold text-text-primary mb-1">Create your account</h1>
              <p className="text-sm text-text-muted mb-6">
                No account for <span className="text-text-secondary font-medium">{email}</span> yet — let's make one
              </p>
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-text-secondary mb-1.5 block">Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    placeholder="Your name"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-text-secondary mb-1.5 block">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-light
                    text-white text-sm font-semibold transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating…' : 'Create account'}
                </button>
              </form>
              <button
                onClick={resetToEmail}
                className="mt-6 text-center w-full text-sm text-text-muted hover:text-text-secondary"
              >
                ← Use a different email
              </button>
            </>
          )}

        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          UTS Internet Programming · Assignment 2 · Individual submission
        </p>
      </div>
    </div>
  );
}
