
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  type: 'login' | 'register';
  role: 'patient' | 'doctor';
}

const AuthLayout = ({ children, title, subtitle, type, role }: AuthLayoutProps) => {
  const oppositePath = type === 'login' 
    ? (role === 'patient' ? '/register-patient' : '/register-doctor')
    : (role === 'patient' ? '/login-patient' : '/login-doctor');
    
  const oppositeLabel = type === 'login'
    ? "Vous n'avez pas de compte? Inscrivez-vous"
    : "Vous avez déjà un compte? Connectez-vous";

  const oppositeRoleLabel = role === 'patient' ? 'médecin' : 'patient';
  const oppositeRolePath = type === 'login'
    ? (role === 'patient' ? '/login-doctor' : '/login-patient')
    : (role === 'patient' ? '/register-doctor' : '/register-patient');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img 
              src="/public/lovable-uploads/c23064ce-de69-4585-b52e-15cf394c7966.png" 
              alt="TbibDaba Logo" 
              className="h-14 w-auto mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="text-center text-sm mt-6 space-y-2">
          <p>
            <Link to={oppositePath} className="text-tbibdaba-teal hover:text-tbibdaba-teal/80">
              {oppositeLabel}
            </Link>
          </p>
          <p>
            <Link to={oppositeRolePath} className="text-tbibdaba-teal hover:text-tbibdaba-teal/80">
              {type === 'login' ? 'Se connecter' : 'S\'inscrire'} en tant que {oppositeRoleLabel}
            </Link>
          </p>
          <p>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Retourner à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
