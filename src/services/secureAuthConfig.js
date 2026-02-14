// Centralized secure auth config for privileged account access.
// In production this should come from backend secrets, but for this mock
// app we support environment-based credentials with safe defaults.

export const secureSuperAdminCredentials = {
  email: import.meta.env.VITE_SUPER_ADMIN_EMAIL || '',
  password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD || '',
  name: import.meta.env.VITE_SUPER_ADMIN_NAME || 'Platform Owner',
};

export const secureDoctorCredentials = {
  email: import.meta.env.VITE_DOCTOR_LOGIN_EMAIL || '',
  password: import.meta.env.VITE_DOCTOR_LOGIN_PASSWORD || '',
  name: 'Dr. Garvit Pathania',
  doctorName: 'Dr. Garvit Pathania',
  department: 'Neurology',
  hospitalName: 'Max Hospital',
  hospitalId: 'hosp-3',
};
