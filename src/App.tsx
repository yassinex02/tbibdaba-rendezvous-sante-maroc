
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import Pricing from "./pages/doctor/Pricing";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
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
            </Route>
            
            {/* Doctor Routes */}
            <Route element={<ProtectedRoute role="doctor" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/analytics" element={<DoctorAnalytics />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
