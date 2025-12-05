import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const PrivateRoute = ({ redirectTo = '/login' }) => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export const GuestRoute = ({ redirectTo = '/profile' }) => {
  const { user } = useAuth();
  return user ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export const AdminRoute = ({ redirectTo = '/profile' }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
