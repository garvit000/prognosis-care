// Centralized secure auth config for privileged account access.
// In production this should come from backend secrets, but for this mock
// app we support environment-based credentials with safe defaults.

export const secureSuperAdminCredentials = {
  email: import.meta.env.VITE_SUPER_ADMIN_EMAIL || '',
  password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD || '',
  name: import.meta.env.VITE_SUPER_ADMIN_NAME || 'Platform Owner',
};
