import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { currentUser, login, forgotPassword, getRoleHomeRoute } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const storedEmail = localStorage.getItem('pc_remembered_email');
    if (storedEmail) {
      setForm((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateForm = () => {
    if (!isValidEmail(form.email)) {
      return 'Please enter a valid email address.';
    }
    if (!form.password) {
      return 'Please enter your password.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);

      if (form.rememberMe) {
        localStorage.setItem('pc_remembered_email', form.email);
      } else {
        localStorage.removeItem('pc_remembered_email');
      }

      navigate('/');
    } catch (authError) {
      setError(authError?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    try {
      await forgotPassword(form.email);
      setToast({ type: 'success', message: 'If your email exists, reset instructions were sent.' });
      setTimeout(() => setToast({ type: '', message: '' }), 3000);
    } catch {
      setToast({ type: 'error', message: 'Unable to process reset right now. Please try again.' });
      setTimeout(() => setToast({ type: '', message: '' }), 3000);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split">
        <aside className="auth-brand-panel animate-fadeIn">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Prognosis Care</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Secure Hospital Authentication</h1>
            <p className="mt-4 max-w-md text-blue-100/90">
              Enterprise-grade access for patients, hospital administrators, and the super admin approval system.
            </p>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-blue-50 shadow-lg">
            Role-based access • Encrypted session token • Approval-controlled hospital onboarding
          </div>
        </aside>

        <section className="auth-form-wrap animate-fadeIn">
          <div className="auth-glass-card">
            {toast.message ? (
              <div
                className={`mb-4 rounded-xl p-3 text-sm ${
                  toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {toast.message}
              </div>
            ) : null}

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Login</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">Sign in to continue your healthcare journey.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="floating-field">
                <input
                  className="floating-input"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
                <span className="floating-label">Email</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input pr-12"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
                <span className="floating-label">Password</span>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-xs font-semibold text-med-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(event) => setForm((prev) => ({ ...prev, rememberMe: event.target.checked }))}
                  />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-med-700" onClick={handleForgotPassword}>
                  Forgot Password?
                </button>
              </div>

              {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

              <button className="btn-primary w-full" type="submit" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spinner" /> Signing in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <p>
                Hospital admin registration:{' '}
                <Link className="font-semibold text-med-700 transition hover:opacity-80" to="/hospital-signup">
                  Create approved admin account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
