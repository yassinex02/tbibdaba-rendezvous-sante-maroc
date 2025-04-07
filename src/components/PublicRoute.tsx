
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

const PublicRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || 
               (user?.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
