import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

function HospitalDashboardPage() {
  const { currentUser } = useAuth();
  const { state, addDoctor, updateDoctor, removeDoctor, updateAppointmentStatus, cancelAppointment, uploadReport } = useApp();
  const [newDoctor, setNewDoctor] = useState({
    fullName: '',
    gender: 'Male',
    department: state.departments[0] || 'General Medicine',
    specialization: '',
    experienceYears: 8,
    educationShort: '',
    mbbsInstitution: 'AIIMS New Delhi',
    mbbsYear: '2012',
    advancedDegree: 'MD',
    advancedInstitution: 'CMC Vellore',
    advancedYear: '2017',
    consultationFee: 900,
    languages: 'English, Hindi',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    professionalBio: '',
    availableTimeSlots: ['10:00 AM', '12:00 PM', '4:00 PM'],
    weeklyAvailability: {
      Monday: '10:00 AM - 5:00 PM',
      Tuesday: '10:00 AM - 5:00 PM',
      Wednesday: '10:00 AM - 5:00 PM',
      Thursday: '10:00 AM - 5:00 PM',
      Friday: '10:00 AM - 5:00 PM',
      Saturday: '10:00 AM - 2:00 PM',
      Sunday: 'Off',
    },
  });
  const [reportFileName, setReportFileName] = useState('hospital-lab-report.pdf');

  const hospitalDoctors = useMemo(
    () => state.doctors.filter((doctor) => doctor.hospitalId === currentUser?.hospitalId),
    [state.doctors, currentUser?.hospitalId]
  );

  const hospitalAppointments = useMemo(
    () => state.appointments.filter((appointment) => appointment.hospital_id === currentUser?.hospitalId),
    [state.appointments, currentUser?.hospitalId]
  );

  const todayDate = new Date().toISOString().slice(0, 10);
  const todaysAppointments = hospitalAppointments.filter((appointment) => appointment.date === todayDate);
  const upcomingAppointments = hospitalAppointments.filter((appointment) => appointment.date >= todayDate);

  const labTestsPending = state.latestBooking && state.latestBooking.hospital.id === currentUser?.hospitalId && state.latestBooking.reportStatus !== 'Available'
    ? [state.latestBooking]
    : [];

  const revenue = hospitalAppointments
    .filter((appointment) => appointment.status !== 'Cancelled')
    .reduce((sum, appointment) => sum + Number(appointment.consultationFee || 0), 0);

  const handleAddDoctor = (event) => {
    event.preventDefault();
    addDoctor(newDoctor, currentUser.hospitalId, currentUser.hospitalName);
    setNewDoctor((prev) => ({ ...prev, fullName: '', specialization: '', professionalBio: '' }));
  };

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Doctor Admin Panel</p>
        <h2 className="mt-1 text-xl font-semibold">{currentUser?.hospitalName}</h2>
        <p className="mt-1 text-sm text-slate-600">Manage doctor operations, appointments, and lab report workflow.</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="card"><p className="text-xs text-slate-500">Today's Appointments</p><p className="text-2xl font-bold text-med-700">{todaysAppointments.length}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Upcoming Appointments</p><p className="text-2xl font-bold text-med-700">{upcomingAppointments.length}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Lab Tests Pending</p><p className="text-2xl font-bold text-med-700">{labTestsPending.length}</p></article>
        <article className="card"><p className="text-xs text-slate-500">Revenue Summary</p><p className="text-2xl font-bold text-med-700">₹{revenue}</p></article>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Add New Doctor</h3>
        <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={handleAddDoctor}>
          <input className="input" placeholder="Full Name" value={newDoctor.fullName} onChange={(e) => setNewDoctor((prev) => ({ ...prev, fullName: e.target.value }))} required />
          <select className="input" value={newDoctor.department} onChange={(e) => setNewDoctor((prev) => ({ ...prev, department: e.target.value }))}>
            {state.departments.map((department) => <option key={department}>{department}</option>)}
          </select>
          <input className="input" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor((prev) => ({ ...prev, specialization: e.target.value }))} required />
          <input className="input" placeholder="Experience (years)" type="number" min="1" value={newDoctor.experienceYears} onChange={(e) => setNewDoctor((prev) => ({ ...prev, experienceYears: e.target.value }))} required />
          <input className="input" placeholder="Education (short)" value={newDoctor.educationShort} onChange={(e) => setNewDoctor((prev) => ({ ...prev, educationShort: e.target.value }))} required />
          <input className="input" placeholder="Consultation Fee" type="number" min="100" value={newDoctor.consultationFee} onChange={(e) => setNewDoctor((prev) => ({ ...prev, consultationFee: e.target.value }))} required />
          <input className="input" placeholder="Languages (comma separated)" value={newDoctor.languages} onChange={(e) => setNewDoctor((prev) => ({ ...prev, languages: e.target.value }))} required />
          <input className="input" placeholder="Profile Photo URL" value={newDoctor.profileImage} onChange={(e) => setNewDoctor((prev) => ({ ...prev, profileImage: e.target.value }))} required />
          <textarea className="input sm:col-span-2" placeholder="Professional Bio" value={newDoctor.professionalBio} onChange={(e) => setNewDoctor((prev) => ({ ...prev, professionalBio: e.target.value }))} required />
          <button className="btn-primary sm:col-span-2" type="submit">Add Doctor</button>
        </form>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Doctors List</h3>
        <div className="mt-3 space-y-2">
          {hospitalDoctors.map((doctor) => (
            <article key={doctor.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{doctor.fullName}</p>
                  <p className="text-sm text-slate-600">{doctor.department} • ₹{doctor.consultationFee}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => updateDoctor(doctor.id, { availabilityStatus: doctor.availabilityStatus === 'Available' ? 'Fully Booked' : 'Available' })}>
                    {doctor.availabilityStatus === 'Available' ? 'Mark Booked' : 'Mark Available'}
                  </button>
                  <button className="btn-secondary" onClick={() => removeDoctor(doctor.id)}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Appointments</h3>
        <div className="mt-3 space-y-2">
          {hospitalAppointments.map((appointment) => (
            <article key={appointment.id} className="rounded-xl border border-slate-100 p-3">
              <p className="font-semibold">{appointment.id} • {appointment.doctorName}</p>
              <p className="text-sm text-slate-600">{appointment.date} • {appointment.time} • {appointment.status}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}>Mark Completed</button>
                <button className="btn-secondary" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Upload Reports</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="input max-w-sm" value={reportFileName} onChange={(e) => setReportFileName(e.target.value)} />
          <button className="btn-primary" onClick={() => uploadReport(reportFileName)}>Upload Report</button>
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Doctor Admin Profile Settings</h3>
        <p className="mt-2 text-sm text-slate-600">Admin: {currentUser?.name}</p>
        <p className="text-sm text-slate-600">Hospital ID: {currentUser?.hospitalId}</p>
        <p className="text-sm text-slate-600">Role: Doctor Admin</p>
      </section>
    </div>
  );
}

export default HospitalDashboardPage;
