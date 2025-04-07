
import { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const AppLayout = ({ children, showFooter = true }: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
