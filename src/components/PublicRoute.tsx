
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

  // Add custom transition effect when redirecting
  useEffect(() => {
    if (isAuthenticated) {
      // Add class to body for page transition
      document.body.classList.add('page-exit');
      
      // Small delay before redirecting to allow for animation
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('page-exit');
      };
    }
  }, [isAuthenticated, from, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState text="Vérification de votre session..." count={1} />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Return null, the useEffect will handle navigation with transition
  }

  return (
    <div className="page-enter page-enter-active">
      <Outlet />
    </div>
  );
};

export default PublicRoute;
