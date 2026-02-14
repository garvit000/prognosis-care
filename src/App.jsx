import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import TriagePage from './pages/TriagePage';
import LabBookingPage from './pages/LabBookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import AdminHospitalPanelPage from './pages/AdminHospitalPanelPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationToast from './components/NotificationToast';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/triage', label: 'AI Assistant' },
  { to: '/medical-records', label: 'Medical Records' },
  { to: '/admin/hospital', label: 'Hospital Panel' },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Prognosis Care</p>
            <h1 className="text-lg font-bold">AI Healthcare Triage & Diagnostics</h1>
          </div>
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
        </div>
      </header>

      <main className="animate-fadeIn">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/triage" element={<TriagePage />} />
          <Route path="/lab-booking" element={<LabBookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/admin/hospital" element={<AdminHospitalPanelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <NotificationToast />
    </div>
  );
}

export default App;
