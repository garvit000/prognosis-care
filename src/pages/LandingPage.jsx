import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function LandingPage() {
  const navigate = useNavigate();
  const { state, updatePatientProfile } = useApp();
  const [formData, setFormData] = useState({
    name: state.patient.name || '',
    dob: state.patient.dob || '',
    bloodGroup: state.patient.bloodGroup || '',
    gender: state.patient.gender || '',
    emergencyContact: state.patient.emergencyContact || '',
    lastCheckupDate: state.patient.lastCheckupDate || '',
    bp: state.patient.bp || '',
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePatientProfile(formData);
    navigate('/dashboard');
  };

  return (
    <div className="page-shell">
      <section className="card mx-auto w-full max-w-3xl">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Welcome Setup</p>
          <h2 className="mt-1 text-2xl font-bold">Complete your patient details</h2>
          <p className="mt-1 text-sm text-slate-600">
            Fill these details once. They will be saved and used automatically in your dashboard.
          </p>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="text-sm text-slate-700 sm:col-span-2">
            Full Name
            <input
              className="input mt-1"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </label>

          <label className="text-sm text-slate-700">
            Date of Birth
            <input
              type="date"
              className="input mt-1"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              required
            />
          </label>

          <label className="text-sm text-slate-700">
            Blood Group
            <select
              className="input mt-1"
              value={formData.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </label>

          <label className="text-sm text-slate-700">
            Gender
            <select
              className="input mt-1"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="text-sm text-slate-700">
            Last Checkup Date
            <input
              type="date"
              className="input mt-1"
              value={formData.lastCheckupDate}
              onChange={(e) => handleChange('lastCheckupDate', e.target.value)}
              required
            />
          </label>

          <label className="text-sm text-slate-700">
            Emergency Contact
            <input
              className="input mt-1"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              required
            />
          </label>

          <label className="text-sm text-slate-700">
            Blood Pressure (e.g. 120/80)
            <input
              className="input mt-1"
              value={formData.bp}
              onChange={(e) => handleChange('bp', e.target.value)}
              required
            />
          </label>

          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full">
              Save Details & Continue
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LandingPage;
