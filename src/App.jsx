import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import TriagePage from './pages/TriagePage';
import LabBookingPage from './pages/LabBookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import AdminHospitalPanelPage from './pages/AdminHospitalPanelPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotificationToast from './components/NotificationToast';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/triage', label: 'AI Assistant' },
  { to: '/medical-records', label: 'Medical Records' },
  { to: '/admin/hospital', label: 'Hospital Panel' },
];

function App() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {currentUser ? (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Prognosis Care</p>
              <h1 className="text-lg font-bold">AI Healthcare Triage & Diagnostics</h1>
            </div>
            <div className="flex items-center gap-2">
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive ? 'bg-med-100 text-med-700' : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <button type="button" className="btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </header>
      ) : null}

      <main className="animate-fadeIn">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/triage"
            element={
              <ProtectedRoute>
                <TriagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab-booking"
            element={
              <ProtectedRoute>
                <LabBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation"
            element={
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute>
                <MedicalRecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hospital"
            element={
              <ProtectedRoute>
                <AdminHospitalPanelPage />
              </ProtectedRoute>
            }
          />
          <Route path="/app" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {currentUser ? <NotificationToast /> : null}
    </div>
  );
}

export default App;
