import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // or however you store auth info

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}