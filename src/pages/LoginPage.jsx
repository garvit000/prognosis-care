import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { currentUser, login, isFirebaseConfigured, firebaseConfigError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (authError) {
      setError('Unable to login. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[75vh] items-center justify-center">
      <section className="card w-full max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Firebase Auth</p>
        <h2 className="mt-1 text-2xl font-bold">Login</h2>

        {!isFirebaseConfigured ? (
          <p className="mt-3 rounded-xl bg-amber-50 p-2 text-xs text-amber-700">
            Firebase config missing. Running in local mock auth mode. {firebaseConfigError}
          </p>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Email
            <input
              className="input mt-1"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>

          <label className="block text-sm text-slate-700">
            Password
            <input
              className="input mt-1"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </label>

          {error ? <p className="rounded-xl bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          New user?{' '}
          <Link className="font-semibold text-med-700" to="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
