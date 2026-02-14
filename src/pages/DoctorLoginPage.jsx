import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DoctorLoginPage() {
    const { currentUser, doctorLogin, getRoleHomeRoute } = useAuth();
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
            await doctorLogin(form.email, form.password);
            navigate('/doctor-workspace');
        } catch (err) {
            setError(err?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-split">
                <aside className="auth-brand-panel animate-fadeIn bg-emerald-700">
                    {/* Overriding gradient with solid color or different gradient key if needed, 
              but auth-brand-panel usually has a gradient. 
              Let's keep the standard structure but change text. */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">Medical Staff Access</p>
                        <h1 className="mt-3 text-4xl font-bold leading-tight">Doctor Workspace</h1>
                        <p className="mt-4 max-w-md text-emerald-100/90">
                            Access your patient records, appointments, and diagnostic tools in one secure place.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-emerald-50 shadow-lg">
                        HIPAA Compliant • Secure Access • Clinical Tools
                    </div>
                </aside>

                <section className="auth-form-wrap animate-fadeIn">
                    <div className="auth-glass-card">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Secure Audit Log</p>
                        {/* Using emerald theme for doctors to distinguish from blue hospital admin */}
                        <h2 className="mt-1 text-3xl font-bold text-slate-900">Doctor Login</h2>
                        <p className="mt-2 text-sm text-slate-600">Welcome back, Doctor. Please sign in.</p>

                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            <div className="floating-field">
                                <input
                                    type="email"
                                    className="floating-input focus:border-emerald-500"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                />
                                <span className="floating-label">Email</span>
                            </div>

                            <div className="floating-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="floating-input pr-12 focus:border-emerald-500"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                                />
                                <span className="floating-label">Password</span>
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-xs font-semibold text-emerald-700"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

                            <button className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 border-emerald-600" type="submit" disabled={loading}>
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="spinner" /> Authenticating...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
                            <p>
                                Not a doctor?{' '}
                                <Link className="font-semibold text-emerald-700 transition hover:opacity-80" to="/auth">
                                    Go back to options
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DoctorLoginPage;
