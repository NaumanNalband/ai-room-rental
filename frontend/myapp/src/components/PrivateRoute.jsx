import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;

  return children;
}