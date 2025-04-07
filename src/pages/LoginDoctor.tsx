
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { Loader2 } from 'lucide-react';

const LoginDoctor = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password, 'doctor');
      if (success) {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Connexion Médecin" 
      subtitle="Accédez à votre espace professionnel pour gérer vos patients"
      type="login"
      role="doctor"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <a href="#" className="text-sm text-tbibdaba-teal hover:underline">
                Mot de passe oublié?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              className="mt-1"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white py-6" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </Button>

        <div className="text-center text-gray-500 text-sm">
          <p>
            Pour cette démo, utilisez:
            <br />
            Email: doctor@example.com (plan basic)
            <br />
            ou premium@example.com (plan premium)
            <br />
            Mot de passe: password
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginDoctor;
