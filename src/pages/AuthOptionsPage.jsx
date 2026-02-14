import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalBackButton from '../components/PortalBackButton';

function AuthOptionsPage() {
  const { currentUser, getRoleHomeRoute } = useAuth();

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  return (
    <div className="page-shell flex min-h-[75vh] items-center justify-center py-8">
      <section className="card w-full max-w-4xl">
        <PortalBackButton fallbackPath="/" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Authentication Portal</p>
        <h2 className="mt-1 text-2xl font-bold">Choose your account type</h2>
        <p className="mt-2 text-sm text-slate-600">Select one of the options below to login or create a new account.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold">User / Patient</h3>
            <p className="mt-1 text-sm text-slate-600">Book appointments, use triage, and track your records.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/signup" className="btn-secondary">Sign Up</Link>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold">Hospital Admin</h3>
            <p className="mt-1 text-sm text-slate-600">Manage hospital doctors, appointments, and operations.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/hospital-login" className="btn-primary">Login</Link>
              <Link to="/hospital-signup" className="btn-secondary">Sign Up</Link>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold">Super Admin</h3>
            <p className="mt-1 text-sm text-slate-600">Approve hospitals and control the full platform.</p>
            <div className="mt-4 flex gap-2">
              <Link to="/super-admin-login" className="btn-primary">Login</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AuthOptionsPage;
