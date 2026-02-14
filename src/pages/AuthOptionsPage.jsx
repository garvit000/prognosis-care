import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthOptionsPage() {
  const { currentUser, getRoleHomeRoute } = useAuth();

  if (currentUser) {
    return <Navigate to={getRoleHomeRoute(currentUser.role)} replace />;
  }

  return (
    <div className="auth-shell relative overflow-hidden" 
            style={{
              backgroundImage:
                "url('/images/auth-bg.avif')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-med-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-blue-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="page-shell flex min-h-[75vh] items-center justify-center py-8" >
        <section className="card relative w-full max-w-4xl overflow-hidden bg-blue-200/90 backdrop-blur-sm">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-photo/health-still-life-with-copy-space_23-2148854031.jpg?semt=ais_user_personalization&w=740&q=80')",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-blue-200/72" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Authentication Portal</p>
            <h2 className="mt-1 text-2xl font-bold">Choose your account type</h2>
            <p className="mt-2 text-sm text-slate-600">Select one of the options below to login or create a new account.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-lg font-semibold">Patient</h3>
              <p className="mt-1 text-sm text-slate-600">Book appointments, use triage, and track your records.</p>
              <div className="mt-4 flex gap-2">
                <Link to="/login" className="btn-primary">Login</Link>
                <Link to="/signup" className="btn-secondary">Sign Up</Link>
              </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold">Doctor Login</h3>
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
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthOptionsPage;
