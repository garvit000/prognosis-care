import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SuperAdminLoginPage() {
  const { currentUser, superAdminLogin, getRoleHomeRoute } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await superAdminLogin(form.email, form.password);
      navigate('/super-admin-dashboard');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split">
        <aside className="auth-brand-panel animate-fadeIn">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Super Admin Access</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Platform Governance Console</h1>
            <p className="mt-4 max-w-md text-blue-100/90">
              Secure login for company-level approvals, hospital governance, and compliance operations.
            </p>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-blue-50 shadow-lg">
            Controlled access • Approval workflow • Audit-ready records
          </div>
        </aside>

        <section className="auth-form-wrap animate-fadeIn">
          <div className="auth-glass-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Super Admin Login</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Sign in securely</h2>
            <p className="mt-2 text-sm text-slate-600">Use your organization-level credentials to continue.</p>

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

              {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

              <button className="btn-primary w-full" type="submit" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spinner" /> Signing in...
                  </span>
                ) : (
                  'Login as Super Admin'
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <p>
                Hospital admin access:{' '}
                <Link className="font-semibold text-med-700 transition hover:opacity-80" to="/login?role=hospital-admin">
                  Login
                </Link>
              </p>
              <p className="mt-1">
                Need registration approval flow?{' '}
                <Link className="font-semibold text-med-700 transition hover:opacity-80" to="/hospital-signup">
                  Open Hospital Signup
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SuperAdminLoginPage;
