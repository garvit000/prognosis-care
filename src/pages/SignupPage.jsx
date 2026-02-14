import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
  const { currentUser, signup, getRoleHomeRoute } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(form.email, form.password);
      navigate('/welcome');
    } catch (signupError) {
      setError(signupError?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split">
        <aside className="auth-brand-panel animate-fadeIn">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Patient Onboarding</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Create your patient account</h1>
            <p className="mt-4 max-w-md text-blue-100/90">
              Access AI triage, appointments, records, and hospital recommendations from one secure place.
            </p>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-blue-50 shadow-lg">
            Patient-first experience • Secure sessions • Fast onboarding
          </div>
        </aside>

        <section className="auth-form-wrap animate-fadeIn">
          <div className="auth-glass-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Patient Signup</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Create account</h2>
            <p className="mt-2 text-sm text-slate-600">Start your healthcare journey in under a minute.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="floating-field">
                <input
                  type="email"
                  className="floating-input"
                  placeholder="Email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
                <span className="floating-label">Email</span>
              </div>

              <div className="floating-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="floating-input pr-12"
                  placeholder="Create Password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
                <span className="floating-label">Create Password</span>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-xs font-semibold text-med-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="floating-field">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="floating-input pr-12"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                />
                <span className="floating-label">Confirm Password</span>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-xs font-semibold text-med-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

              <button className="btn-primary w-full" type="submit" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spinner" /> Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <p>
                Already have an account?{' '}
                <Link className="font-semibold text-med-700 transition hover:opacity-80" to="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SignupPage;
