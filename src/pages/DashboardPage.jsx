import { Link } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { formatINR } from '../components/BillingBreakdown';

const bpTrendData = [
  { day: 'Mon', systolic: 146 },
  { day: 'Tue', systolic: 150 },
  { day: 'Wed', systolic: 142 },
  { day: 'Thu', systolic: 148 },
  { day: 'Fri', systolic: 145 },
  { day: 'Sat', systolic: 140 },
];

function DashboardPage() {
  const { state } = useApp();

  return (
    <div className="page-shell space-y-4">
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="card lg:col-span-2">
          <h2 className="text-xl font-semibold">Health Snapshot</h2>
          <p className="mt-1 text-sm text-slate-600">AI monitoring trend for cardiovascular risk indicators.</p>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer>
              <LineChart data={bpTrendData}>
                <Line type="monotone" dataKey="systolic" stroke="#1468d6" strokeWidth={3} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-3 space-y-2">
            <Link className="btn-primary w-full" to="/triage">
              Run AI Triage
            </Link>
            <Link className="btn-secondary w-full" to="/lab-booking">
              Book Recommended Tests
            </Link>
            <Link className="btn-secondary w-full" to="/medical-records">
              View Medical Records
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="card">
          <h3 className="text-lg font-semibold">Upcoming Tests</h3>
          {state.latestBooking?.paymentStatus === 'paid' ? (
            <div className="mt-3 text-sm">
              <p className="font-medium">{state.latestBooking.tests.map((t) => t.name).join(', ')}</p>
              <p className="text-slate-600">{new Date(state.latestBooking.slot).toLocaleString()}</p>
              <p className="mt-2 text-xs text-emerald-700">Status: {state.latestBooking.status}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No scheduled tests yet.</p>
          )}
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Payment History</h3>
          {state.paymentHistory.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {state.paymentHistory.map((pay) => (
                <li key={pay.id} className="rounded-lg border border-slate-100 p-2">
                  <p className="font-medium">{pay.invoiceId}</p>
                  <p>{formatINR(pay.amount)} • {pay.method}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No completed payments.</p>
          )}
        </article>

        <article className="card">
          <h3 className="text-lg font-semibold">Lab Reports</h3>
          {state.reports.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {state.reports.map((report) => (
                <li key={report.reportId} className="rounded-lg border border-slate-100 p-2">
                  <p className="font-medium">{report.fileName}</p>
                  <p className="text-emerald-700">{report.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Pending report upload.</p>
          )}
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;
