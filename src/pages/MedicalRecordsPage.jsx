import { useApp } from '../context/AppContext';

function MedicalRecordsPage() {
  const { state } = useApp();

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <p className="mt-1 text-sm text-slate-600">All lab reports and diagnostic documents are listed below.</p>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Lab Reports</h3>
        {!state.reports.length ? (
          <p className="mt-3 text-sm text-slate-500">No reports available yet. You will receive a notification once uploaded.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {state.reports.map((report) => (
              <article key={report.reportId} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{report.fileName}</p>
                    <p className="text-sm text-slate-600">{report.testNames.join(', ')}</p>
                    <p className="text-xs text-slate-500">Uploaded: {new Date(report.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{report.status}</span>
                    <button className="btn-secondary">Download PDF</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MedicalRecordsPage;
