import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ALLOWED_HOSPITALS } from '../services/adminStore';

const acceptedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

function HospitalSignupPage() {
  const { hospitalSignup } = useAuth();
  const [form, setForm] = useState({
    hospitalName: ALLOWED_HOSPITALS[0],
    adminName: '',
    contactEmail: '',
    phone: '',
    registrationNumber: '',
    address: '',
    city: '',
    state: '',
    adminRole: 'Hospital Admin',
    password: '',
    confirmPassword: '',
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 3500);
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isStrongPassword = (value) =>
    value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Unable to read file.'));
      reader.readAsDataURL(file);
    });

  const handleFileChange = (event) => {
    setError('');
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setLicenseFile(null);
      return;
    }

    if (!acceptedMimeTypes.includes(selectedFile.type)) {
      setError('Only PDF, JPG, or PNG files are allowed.');
      event.target.value = '';
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be 5MB or less.');
      event.target.value = '';
      return;
    }

    setLicenseFile(selectedFile);
  };

  const validateForm = () => {
    if (!ALLOWED_HOSPITALS.includes(form.hospitalName)) {
      return 'Please select a valid hospital.';
    }
    if (!isValidEmail(form.contactEmail)) {
      return 'Please enter a valid work email.';
    }
    if (!licenseFile) {
      return 'Please upload a hospital license.';
    }
    if (!isStrongPassword(form.password)) {
      return 'Password must include 8+ chars, uppercase, number, and special character.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const licenseFileDataUrl = await fileToDataUrl(licenseFile);

      const response = await hospitalSignup({
        ...form,
        licenseFileName: licenseFile.name,
        licenseFileType: licenseFile.type,
        licenseFileSize: licenseFile.size,
        licenseFileDataUrl,
      });

      if (!response.ok) {
        setError(response.error || 'Unable to submit hospital registration request.');
        setLoading(false);
        return;
      }

      showToast('success', 'Registration submitted. Status: Pending Approval.');
      setForm({
        hospitalName: ALLOWED_HOSPITALS[0],
        adminName: '',
        contactEmail: '',
        phone: '',
        registrationNumber: '',
        address: '',
        city: '',
        state: '',
        adminRole: 'Hospital Admin',
        password: '',
        confirmPassword: '',
      });
      setLicenseFile(null);
    } catch {
      setError('Unable to process your file. Please try another file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split">
        <aside className="auth-brand-panel animate-fadeIn">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Hospital Onboarding</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Secure Admin Registration</h1>
            <p className="mt-4 max-w-md text-blue-100/90">
              Submit your hospital admin request. Access will be enabled only after super admin approval.
            </p>
          </div>
          <ul className="rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-blue-50 shadow-lg">
            <li>• Restricted hospital list</li>
            <li>• License validation (PDF/JPG/PNG, max 5MB)</li>
            <li>• Duplicate admin prevention</li>
          </ul>
        </aside>

        <section className="auth-form-wrap animate-fadeIn">
          <div className="auth-glass-card">
            {toast.message ? (
              <div
                className={`mb-4 rounded-xl p-3 text-sm ${
                  toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {toast.message}
              </div>
            ) : null}

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Signup</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Hospital Admin Request</h2>
            <p className="mt-2 text-sm text-slate-600">Complete details for approval workflow verification.</p>

            <form className="mt-6 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div className="floating-field sm:col-span-2">
                <select
                  className="floating-input"
                  value={form.hospitalName}
                  onChange={(event) => setForm((prev) => ({ ...prev, hospitalName: event.target.value }))}
                >
                  {ALLOWED_HOSPITALS.map((hospital) => (
                    <option key={hospital} value={hospital}>
                      {hospital}
                    </option>
                  ))}
                </select>
                <span className="floating-label">Hospital</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input"
                  placeholder="Admin Name"
                  value={form.adminName}
                  onChange={(event) => setForm((prev) => ({ ...prev, adminName: event.target.value }))}
                />
                <span className="floating-label">Admin Name</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input"
                  type="email"
                  placeholder="Work Email"
                  value={form.contactEmail}
                  onChange={(event) => setForm((prev) => ({ ...prev, contactEmail: event.target.value }))}
                />
                <span className="floating-label">Work Email</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
                <span className="floating-label">Phone</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input"
                  placeholder="Registration Number"
                  value={form.registrationNumber}
                  onChange={(event) => setForm((prev) => ({ ...prev, registrationNumber: event.target.value }))}
                />
                <span className="floating-label">Registration Number</span>
              </div>

              <div className="floating-field sm:col-span-2">
                <input
                  className="floating-input"
                  placeholder="Hospital Address"
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                />
                <span className="floating-label">Hospital Address</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input"
                  placeholder="City"
                  value={form.city}
                  onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                />
                <span className="floating-label">City</span>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input"
                  placeholder="State"
                  value={form.state}
                  onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
                />
                <span className="floating-label">State</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Upload License (PDF/JPG/PNG, max 5MB)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="input mt-2"
                  onChange={handleFileChange}
                />
                {licenseFile ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Selected: {licenseFile.name} ({Math.round(licenseFile.size / 1024)} KB)
                  </p>
                ) : null}
              </div>

              <div className="floating-field">
                <input
                  className="floating-input pr-12"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
                <span className="floating-label">Create Password</span>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-xs font-semibold text-med-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="floating-field">
                <input
                  className="floating-input pr-12"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                />
                <span className="floating-label">Confirm Password</span>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-xs font-semibold text-med-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {error ? <p className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

              <button className="btn-primary sm:col-span-2" type="submit" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spinner" /> Submitting...
                  </span>
                ) : (
                  'Submit for Approval'
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <p>
                Already approved?{' '}
                <Link className="font-semibold text-med-700 transition hover:opacity-80" to="/login?role=hospital-admin">
                  Login as Hospital Admin
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HospitalSignupPage;
