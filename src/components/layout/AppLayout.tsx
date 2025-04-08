
import { ReactNode, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, AlertTriangle, Users } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const AppLayout = ({ children, showFooter = true }: AppLayoutProps) => {
  // Add meta viewport check for mobile
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="skip-to-content">
        Passer au contenu principal
      </a>
      <Header />
      <main id="main-content" className="flex-grow bg-gray-50 w-full">
        {children}
      </main>
      {showFooter && <Footer />}
      
      {/* Add Toaster for notification messages */}
      <Toaster />
    </div>
  );
};

// Create LoadingState component for consistent loading UI
export const LoadingState = ({ 
  text = "Chargement en cours...", 
  count = 3 
}: { 
  text?: string;
  count?: number;
}) => {
  return (
    <div className="w-full space-y-4 p-8" aria-live="polite" aria-busy="true">
      <div className="text-center text-gray-500 mb-4 flex items-center justify-center">
        <Clock className="animate-spin mr-2 h-5 w-5 text-tbibdaba-teal" />
        {text}
        <div className="loading-dots ml-2">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
};

// Create EmptyState component for consistent empty state UI
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" aria-live="polite">
      <Icon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-tbibdaba-teal text-white rounded-md hover:bg-tbibdaba-teal/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Create ErrorState component for error handling
export const ErrorState = ({
  title = "Une erreur est survenue",
  description = "Nous n'avons pas pu charger les données. Veuillez réessayer plus tard.",
  actionLabel = "Réessayer",
  onRetry
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" aria-live="assertive">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-tbibdaba-teal text-white rounded-md hover:bg-tbibdaba-teal/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Create SuccessMetrics component to display success metrics
export const SuccessMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="success-metric">
        <div className="flex items-start">
          <CheckCircle2 className="text-tbibdaba-teal mr-3 mt-1" />
          <div>
            <div className="success-metric-number">94%</div>
            <div className="success-metric-text">des utilisateurs réservent un rendez-vous en moins de 3 minutes</div>
          </div>
        </div>
      </div>
      <div className="success-metric">
        <div className="flex items-start">
          <Clock className="text-tbibdaba-teal mr-3 mt-1" />
          <div>
            <div className="success-metric-number">-65%</div>
            <div className="success-metric-text">de temps d'attente pour les patients</div>
          </div>
        </div>
      </div>
      <div className="success-metric">
        <div className="flex items-start">
          <Users className="text-tbibdaba-teal mr-3 mt-1" />
          <div>
            <div className="success-metric-number">+2500</div>
            <div className="success-metric-text">médecins à travers le Maroc</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create UserSegments component to display user segments
export const UserSegments = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="user-segment user-segment-urban">
        <h4 className="user-segment-title">Patients urbains</h4>
        <p className="user-segment-desc">
          Réservation rapide avec une large sélection de spécialistes dans les grandes villes.
        </p>
      </div>
      <div className="user-segment user-segment-rural">
        <h4 className="user-segment-title">Patients ruraux</h4>
        <p className="user-segment-desc">
          Accès à des consultations à distance et aide à la recherche de spécialistes proches.
        </p>
      </div>
    </div>
  );
};

// Create Testimonials component to display testimonials
export const Testimonials = () => {
  const testimonials = [
    {
      quote: "J'ai trouvé un spécialiste et pris rendez-vous en quelques clics, sans attente téléphonique!",
      name: "Fatima B.",
      role: "Patiente à Casablanca",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "TbibDaba m'a permis d'optimiser mon emploi du temps et de réduire les rendez-vous manqués de 40%.",
      name: "Dr. Ahmed K.",
      role: "Cardiologue à Rabat",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial-card">
          <p className="testimonial-quote">{testimonial.quote}</p>
          <div className="testimonial-author">
            <img src={testimonial.image} alt={testimonial.name} className="testimonial-author-image" />
            <div>
              <p className="testimonial-author-name">{testimonial.name}</p>
              <p className="testimonial-author-role">{testimonial.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Create ProgressSteps component for multi-step processes
export const ProgressSteps = ({ 
  steps, 
  currentStep 
}: { 
  steps: string[],
  currentStep: number
}) => {
  return (
    <div className="steps-container">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`step ${index < currentStep ? 'step-completed' : index === currentStep ? 'step-active' : ''}`}
        >
          <div className="step-circle">
            {index < currentStep ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && <div className="step-line"></div>}
          <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
};

export default AppLayout;
