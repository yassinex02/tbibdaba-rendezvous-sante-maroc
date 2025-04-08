
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';
import { useEffect } from 'react';
import { LoadingState } from './layout/AppLayout';

const PublicRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || 
               (user?.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');

  // Fix for browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Force reload to ensure proper navigation state
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState text="Vérification de votre session..." count={1} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
