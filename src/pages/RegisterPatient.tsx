
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { Loader2 } from 'lucide-react';
import { cities } from '../lib/mock-data';
import RequiredFieldLabel from '../components/RequiredFieldLabel';
import { toast } from '@/components/ui/use-toast';

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    address: '',
    birthdate: '',
    gender: '',
    agreeTos: false,
    insuranceProvider: '',
    insuranceNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.city) {
      newErrors.city = 'La ville est requise';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Le genre est requis';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    }
    
    if (!formData.birthdate) {
      newErrors.birthdate = 'La date de naissance est requise';
    }
    
    if (!formData.agreeTos) {
      newErrors.agreeTos = 'Vous devez accepter les conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchDoctor = () => {
    navigate('/patient/search');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, agreeTos, ...userData } = formData;
      const success = await register(userData, 'patient');
      
      if (success) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
        navigate('/patient/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Inscription Patient" 
      subtitle="Créez votre compte patient pour prendre rendez-vous"
      type="register"
      role="patient"
    >
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={handleSearchDoctor}
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white"
        >
          Rechercher un médecin
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <RequiredFieldLabel>Nom Complet</RequiredFieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <RequiredFieldLabel>Email</RequiredFieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RequiredFieldLabel>Mot de passe</RequiredFieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <RequiredFieldLabel>Confirmer le mot de passe</RequiredFieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre mot de passe"
                className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <div>
            <RequiredFieldLabel>Téléphone</RequiredFieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0600000000"
              className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RequiredFieldLabel>Ville</RequiredFieldLabel>
              <Select
                value={formData.city}
                onValueChange={(value) => handleSelectChange('city', value)}
              >
                <SelectTrigger className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <RequiredFieldLabel>Genre</RequiredFieldLabel>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className={`mt-1 ${errors.gender ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
          
          <div>
            <RequiredFieldLabel>Date de naissance</RequiredFieldLabel>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className={`mt-1 ${errors.birthdate ? 'border-red-500' : ''}`}
            />
            {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
          </div>
          
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Votre adresse"
              className="mt-1"
            />
          </div>
          
          {/* Insurance Information */}
          <div className="pt-2">
            <h3 className="text-lg font-medium">Informations d'assurance (Optionnel)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="insuranceProvider">Assureur</Label>
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  placeholder="Nom de votre assureur"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="insuranceNumber">Numéro d'assurance</Label>
                <Input
                  id="insuranceNumber"
                  name="insuranceNumber"
                  type="text"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                  placeholder="Numéro de votre assurance"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeTos"
              name="agreeTos"
              checked={formData.agreeTos}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, agreeTos: checked as boolean })
              }
              className={errors.agreeTos ? 'border-red-500' : ''}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="agreeTos"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                J'accepte les <a href="#" className="text-tbibdaba-teal hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-tbibdaba-teal hover:underline">politique de confidentialité</a> <span className="text-red-500">*</span>
              </label>
              {errors.agreeTos && <p className="text-red-500 text-xs">{errors.agreeTos}</p>}
            </div>
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
              Inscription en cours...
            </>
          ) : (
            'S\'inscrire'
          )}
        </Button>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPatient;
