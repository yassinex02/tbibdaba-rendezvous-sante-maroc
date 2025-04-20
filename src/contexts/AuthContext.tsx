import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

// Define user types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  subscription?: 'free' | 'basic' | 'premium' | 'enterprise';
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
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

// Mock user data
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const storedUser = localStorage.getItem('tbibdabaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role: 'patient' | 'doctor'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in mock data
      const userList = role === 'patient' ? MOCK_USERS.patients : MOCK_USERS.doctors;
      const foundUser = userList.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Omit password before storing
        const { password, ...userWithoutPassword } = foundUser;
        localStorage.setItem('tbibdabaUser', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword as User);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect",
        });
        return false;
      }
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a user record in a database
      // For demo purposes, we'll just simulate a successful registration
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        role,
        subscription: role === 'doctor' ? 'free' : undefined
      };
      
      // Omit password before storing
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem('tbibdabaUser', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);
      
      toast({
        title: "Inscription réussie",
        description: `Bienvenue, ${userData.name}!`,
      });
      return true;
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
  const logout = () => {
    localStorage.removeItem('tbibdabaUser');
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
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
