
import { ReactNode, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Header />
      <main className="flex-grow bg-gray-50 w-full">
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
    <div className="w-full space-y-4 p-8">
      <div className="text-center text-gray-500 mb-4">{text}</div>
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
    <div className="flex flex-col items-center justify-center py-12 text-center">
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

export default AppLayout;
