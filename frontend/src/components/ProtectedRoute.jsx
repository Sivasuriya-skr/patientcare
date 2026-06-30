import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // If children are passed (e.g. <ProtectedRoute><Layout /></ProtectedRoute>),
  // render them; otherwise fall back to <Outlet /> for bare usage.
  return children ? children : <Outlet />;
}
