
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-12 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/c23064ce-de69-4585-b52e-15cf394c7966.png" 
                alt="TbibDaba Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-tbibdaba-teal">TbibDaba</span>
            </div>
            <p className="text-gray-600 text-sm">
              Votre plateforme de santé digitale au Maroc. Nous connectons les patients aux médecins pour une expérience de santé simplifiée.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-tbibdaba-teal transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-tbibdaba-teal transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-tbibdaba-teal transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/register-patient" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  S'inscrire en tant que patient
                </Link>
              </li>
              <li>
                <Link to="/register-doctor" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  S'inscrire en tant que médecin
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  Tarification
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  À propos de nous
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-tbibdaba-teal transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <Mail size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">contact@tbibdaba.ma</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+212 5XX-XXXXXX</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">Technopolis, Rabat, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} TbibDaba. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
