import { Navigate } from 'react-router-dom';

function HospitalLoginPage() {
  // Dedicated route retained for backward compatibility.
  return <Navigate to="/login?role=hospital-admin" replace />;
}

export default HospitalLoginPage;
