
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import LoginPatient from "./pages/LoginPatient";
import LoginDoctor from "./pages/LoginDoctor";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterDoctor from "./pages/RegisterDoctor";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorAnalytics from "./pages/doctor/Analytics";
import DoctorProfile from "./pages/doctor/Profile";
import PatientProfile from "./pages/patient/Profile";
import SearchDoctors from "./pages/patient/SearchDoctors";
import PatientChat from "./pages/patient/Chat";
import DoctorChat from "./pages/doctor/Chat";
import Pricing from "./pages/doctor/Pricing";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useState, useEffect } from 'react';

// Create a QueryClient with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor and handle offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ChatProvider>
            <TooltipProvider>
              {/* Accessibility: Skip to content link */}
              <a href="#main-content" className="skip-to-content">
                Passer au contenu principal
              </a>
              
              {/* Offline indicator */}
              {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
                  Vous êtes actuellement hors ligne. Certaines fonctionnalités pourraient être limitées.
                </div>
              )}
              
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route element={<PublicRoute />}>
                    <Route path="/login-patient" element={<LoginPatient />} />
                    <Route path="/login-doctor" element={<LoginDoctor />} />
                    <Route path="/register-patient" element={<RegisterPatient />} />
                    <Route path="/register-doctor" element={<RegisterDoctor />} />
                    <Route path="/pricing" element={<Pricing />} />
                  </Route>
                  
                  {/* Patient Routes */}
                  <Route element={<ProtectedRoute role="patient" />}>
                    <Route path="/patient/dashboard" element={<PatientDashboard />} />
                    <Route path="/patient/appointments" element={<PatientAppointments />} />
                    <Route path="/patient/profile" element={<PatientProfile />} />
                    <Route path="/patient/search" element={<SearchDoctors />} />
                    <Route path="/patient/chat" element={<PatientChat />} />
                  </Route>
                  
                  {/* Doctor Routes */}
                  <Route element={<ProtectedRoute role="doctor" />}>
                    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                    <Route path="/doctor/analytics" element={<DoctorAnalytics />} />
                    <Route path="/doctor/profile" element={<DoctorProfile />} />
                    <Route path="/doctor/chat" element={<DoctorChat />} />
                  </Route>
                  
                  {/* Catch All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ChatProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
