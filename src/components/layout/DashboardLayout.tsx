
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Header';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Calendar, 
  User, 
  Search, 
  BarChart3, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-tbibdaba-teal text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </Link>
);

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isPatient = user?.role === 'patient';

  const patientLinks = [
    { path: '/patient/dashboard', label: 'Tableau de bord', icon: <Home size={20} /> },
    { path: '/patient/search', label: 'Rechercher', icon: <Search size={20} /> },
    { path: '/patient/appointments', label: 'Rendez-vous', icon: <Calendar size={20} /> },
    { path: '/patient/profile', label: 'Mon Profil', icon: <User size={20} /> },
  ];

  const doctorLinks = [
    { path: '/doctor/dashboard', label: 'Tableau de bord', icon: <Home size={20} /> },
    { path: '/doctor/appointments', label: 'Rendez-vous', icon: <Calendar size={20} /> },
    { path: '/doctor/analytics', label: 'Analytique', icon: <BarChart3 size={20} /> },
    { path: '/doctor/profile', label: 'Mon Profil', icon: <User size={20} /> },
  ];

  const links = isPatient ? patientLinks : doctorLinks;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-1">
            {links.map((link) => (
              <SidebarLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                label={link.label}
                isActive={currentPath === link.path}
              />
            ))}
          </div>

          {/* Help and Settings at bottom */}
          <div className="mt-auto space-y-1 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <HelpCircle size={20} className="mr-3" />
              <span>Aide</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings size={20} className="mr-3" />
              <span>Paramètres</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50">
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
