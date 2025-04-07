
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  role?: 'patient' | 'doctor';
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page.",
      });
    } else if (!isLoading && role && user?.role !== role) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les autorisations nécessaires pour accéder à cette page.",
      });
    }
  }, [isLoading, isAuthenticated, role, user]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
