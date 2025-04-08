
import { ReactNode, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';

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
    </div>
  );
};

export default AppLayout;
