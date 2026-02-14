import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

function isToday(dateText) {
  const date = new Date(dateText);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function getStatusForAppointment(appointment) {
  if (appointment.status === 'Cancelled') return 'Cancelled';
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  if (appointmentDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return 'Completed';
  return 'Upcoming';
}

function MyAppointmentsPage() {
  const { state, cancelAppointment } = useApp();

  const sortedAppointments = useMemo(
    () => [...state.appointments]
      .filter((a) => a.status !== 'Cancelled')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.appointments]
  );

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Appointments</p>
        <h2 className="mt-1 text-xl font-semibold">My Appointments</h2>
        <p className="mt-1 text-sm text-slate-600">Total appointments: {sortedAppointments.length}</p>
      </section>

      {!sortedAppointments.length ? (
        <section className="card">
          <p className="text-sm text-slate-500">No appointments booked yet.</p>
        </section>
      ) : (
        <section className="space-y-3">
          {sortedAppointments.map((appointment) => {
            const status = getStatusForAppointment(appointment);
            const today = isToday(appointment.date);

            return (
              <article key={appointment.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{appointment.id}</p>
                    <p className="text-base font-semibold">{appointment.doctorName}</p>
                    <p className="text-sm text-slate-600">{appointment.department}</p>
                  </div>
                  <div className="flex gap-2">
                    {today ? <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Today</span> : null}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        status === 'Upcoming'
                          ? 'bg-emerald-100 text-emerald-700'
                          : status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="font-semibold">Date:</span> {appointment.date}</p>
                  <p><span className="font-semibold">Time:</span> {appointment.time}</p>
                  <p><span className="font-semibold">Consultation Fee:</span> ₹{appointment.consultationFee}</p>
                  <p><span className="font-semibold">Reason:</span> {appointment.reason}</p>
                </div>

                {appointment.uploadedMedicalFile ? (
                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
                    <p className="font-semibold">Uploaded Medical File</p>
                    <p className="text-slate-600">{appointment.uploadedMedicalFile.fileName}</p>
                    {appointment.uploadedMedicalFile.mimeType?.startsWith('image/') && appointment.uploadedMedicalFile.previewUrl ? (
                      <img
                        src={appointment.uploadedMedicalFile.previewUrl}
                        alt={appointment.uploadedMedicalFile.fileName}
                        className="mt-2 h-24 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <p className="mt-1 text-xs text-slate-500">Preview available in Medical Records.</p>
                    )}
                  </div>
                ) : null}

                {status !== 'Cancelled' ? (
                  <button className="btn-secondary mt-3" type="button" onClick={() => cancelAppointment(appointment.id)}>
                    Cancel
                  </button>
                ) : null}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default MyAppointmentsPage;
