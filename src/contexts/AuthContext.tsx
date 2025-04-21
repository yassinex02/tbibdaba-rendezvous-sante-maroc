import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define user types
interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  subscription?: 'free' | 'basic' | 'premium' | 'enterprise';
}

// Auth context type definition
interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<boolean>;
  register: (userData: any, role: 'patient' | 'doctor') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  validateInsurance: (provider: string, policyNumber: string) => { valid: boolean; message?: string };
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
  validateInsurance: () => ({ valid: false }),
});

// Mock user data (fallback for development)
const MOCK_USERS = {
  patients: [
    {
      id: '1',
      name: 'Mohamed Alami',
      email: 'patient@example.com',
      password: 'password',
      role: 'patient',
    },
  ],
  doctors: [
    {
      id: '1',
      name: 'Dr. Yasmine Benali',
      email: 'doctor@example.com',
      password: 'password',
      role: 'doctor',
      subscription: 'basic',
      specialty: 'Cardiologie',
    },
    {
      id: '2',
      name: 'Dr. Omar Kadiri',
      email: 'premium@example.com',
      password: 'password',
      role: 'doctor',
      subscription: 'premium',
      specialty: 'Pédiatrie',
    },
  ],
};

// Mock insurance providers and their validation rules
const VALID_INSURANCE = {
  'CNOPS': {
    pattern: /^CN\d{8}$/,
    message: 'Le numéro de CNOPS doit commencer par CN suivi de 8 chiffres',
  },
  'CNSS': {
    pattern: /^CS\d{8}$/,
    message: 'Le numéro de CNSS doit commencer par CS suivi de 8 chiffres',
  },
  'AMO': {
    pattern: /^AM\d{8}$/,
    message: 'Le numéro d\'AMO doit commencer par AM suivi de 8 chiffres',
  },
  'RMA': {
    pattern: /^RM\d{8}$/,
    message: 'Le numéro de RMA doit commencer par RM suivi de 8 chiffres',
  },
  'MAMDA': {
    pattern: /^MA\d{8}$/,
    message: 'Le numéro de MAMDA doit commencer par MA suivi de 8 chiffres',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          // Get user data from storage or set basic user info
          const userData = localStorage.getItem(`tbibdabaUserData_${session.user.id}`);
          
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // Set minimal user data based on session
            setTimeout(() => {
              // Use setTimeout to avoid potential deadlocks
              // This should ideally fetch user profile from a profiles table
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
                role: session.user.user_metadata?.role || 'patient',
              });
            }, 0);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);
      
      if (session?.user) {
        // Get user data from storage or set basic user info
        const userData = localStorage.getItem(`tbibdabaUserData_${session.user.id}`);
        
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Set minimal user data based on session
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: session.user.user_metadata?.role || 'patient',
          });
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string, role: 'patient' | 'doctor'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Supabase login error:", error);
        
        // Fallback to mock data for development/demo purposes
        const userList = role === 'patient' ? MOCK_USERS.patients : MOCK_USERS.doctors;
        const foundUser = userList.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Omit password before storing
          const { password, ...userWithoutPassword } = foundUser;
          const userData = userWithoutPassword as AppUser;
          
          localStorage.setItem('tbibdabaUser', JSON.stringify(userData));
          localStorage.setItem(`tbibdabaUserData_${userData.id}`, JSON.stringify(userData));
          setUser(userData);
          
          toast({
            title: "Connexion réussie (Mode Demo)",
            description: `Bienvenue, ${foundUser.name}!`,
          });
          return true;
        } else {
          toast({
            variant: "destructive",
            title: "Échec de connexion",
            description: error.message || "Email ou mot de passe incorrect",
          });
          return false;
        }
      }

      // If Supabase login successful
      if (data.user) {
        // Store role information in user metadata
        await supabase.auth.updateUser({
          data: { role }
        });

        // Create or fetch user data
        const userData: AppUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || email.split('@')[0],
          role: role,
        };

        localStorage.setItem(`tbibdabaUserData_${userData.id}`, JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue!`,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: any, role: 'patient' | 'doctor'): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Registering user with Supabase:", { email: userData.email, role });
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: role,
            // Include other user metadata as needed
            phone: userData.phone,
            city: userData.city,
            address: userData.address,
            birthdate: userData.birthdate,
            gender: userData.gender,
            // For doctors
            specialty: userData.specialty,
            subscription: role === 'doctor' ? 'free' : undefined
          }
        }
      });
      
      if (error) {
        console.error("Supabase registration error:", error);
        
        // Fallback to mock registration for development/demo
        console.log("Falling back to mock registration");
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          ...userData,
          role,
          subscription: role === 'doctor' ? 'free' : undefined
        };
        
        // Omit password before storing
        const { password, confirmPassword, ...userWithoutPassword } = newUser;
        const userToStore = userWithoutPassword as AppUser;
        
        localStorage.setItem('tbibdabaUser', JSON.stringify(userToStore));
        localStorage.setItem(`tbibdabaUserData_${userToStore.id}`, JSON.stringify(userToStore));
        setUser(userToStore);
        
        toast({
          title: "Inscription réussie (Mode Demo)",
          description: `Bienvenue, ${userData.name}!`,
        });
        return true;
      }

      // If Supabase registration successful
      if (data.user) {
        const userToStore: AppUser = {
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          role: role,
          subscription: role === 'doctor' ? 'free' : undefined
        };
        
        localStorage.setItem(`tbibdabaUserData_${userToStore.id}`, JSON.stringify(userToStore));
        setUser(userToStore);
        
        toast({
          title: "Inscription réussie",
          description: `Bienvenue, ${userData.name}!`,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Register error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('tbibdabaUser');
      setUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la déconnexion.",
      });
    }
  };

  // Insurance validation function
  const validateInsurance = (provider: string, policyNumber: string) => {
    // If either field is empty, return invalid with no message
    if (!provider || !policyNumber.trim()) {
      return { valid: false };
    }

    // Check if provider exists
    if (!VALID_INSURANCE[provider as keyof typeof VALID_INSURANCE]) {
      return { 
        valid: false, 
        message: 'Ce fournisseur d\'assurance n\'est pas reconnu'
      };
    }

    // Validate policy number against pattern
    const insuranceRules = VALID_INSURANCE[provider as keyof typeof VALID_INSURANCE];
    if (!insuranceRules.pattern.test(policyNumber)) {
      return {
        valid: false,
        message: insuranceRules.message
      };
    }

    // All validation passed
    return { valid: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        validateInsurance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
