
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Calendar, BarChart3, Home, Search } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  const patientLinks = [
    { name: 'Accueil', path: '/patient/dashboard', icon: <Home size={18} /> },
    { name: 'Rechercher', path: '/patient/search', icon: <Search size={18} /> },
    { name: 'Rendez-vous', path: '/patient/appointments', icon: <Calendar size={18} /> },
    { name: 'Profil', path: '/patient/profile', icon: <User size={18} /> },
  ];

  const doctorLinks = [
    { name: 'Accueil', path: '/doctor/dashboard', icon: <Home size={18} /> },
    { name: 'Rendez-vous', path: '/doctor/appointments', icon: <Calendar size={18} /> },
    { name: 'Analytique', path: '/doctor/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Profil', path: '/doctor/profile', icon: <User size={18} /> },
  ];

  const activeLinks = isPatient ? patientLinks : isDoctor ? doctorLinks : [];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img 
                src="/public/lovable-uploads/c23064ce-de69-4585-b52e-15cf394c7966.png" 
                alt="TbibDaba Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-tbibdaba-teal">TbibDaba</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {isAuthenticated ? (
              <>
                {activeLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className="text-gray-600 hover:text-tbibdaba-teal transition-colors flex items-center gap-1"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-1" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login-patient" className="text-gray-600 hover:text-tbibdaba-teal transition-colors">
                  Connexion Patient
                </Link>
                <Link to="/login-doctor" className="text-gray-600 hover:text-tbibdaba-teal transition-colors">
                  Connexion Médecin
                </Link>
                <Button asChild variant="outline" className="border-tbibdaba-teal text-tbibdaba-teal hover:bg-tbibdaba-teal hover:text-white">
                  <Link to="/register-patient">Inscription Patient</Link>
                </Button>
                <Button asChild className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white">
                  <Link to="/register-doctor">Inscription Médecin</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="bg-white p-2 rounded-md text-gray-600 hover:text-tbibdaba-teal focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                {activeLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-tbibdaba-teal flex items-center"
                    onClick={closeMenu}
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block py-2 px-3 rounded-md text-base font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 flex items-center"
                >
                  <LogOut size={18} />
                  <span className="ml-2">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login-patient" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-tbibdaba-teal"
                  onClick={closeMenu}
                >
                  Connexion Patient
                </Link>
                <Link 
                  to="/login-doctor" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-tbibdaba-teal"
                  onClick={closeMenu}
                >
                  Connexion Médecin
                </Link>
                <Link 
                  to="/register-patient" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-tbibdaba-teal"
                  onClick={closeMenu}
                >
                  Inscription Patient
                </Link>
                <Link 
                  to="/register-doctor" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-tbibdaba-teal"
                  onClick={closeMenu}
                >
                  Inscription Médecin
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
