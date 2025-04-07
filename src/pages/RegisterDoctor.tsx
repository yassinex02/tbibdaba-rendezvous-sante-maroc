
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { Loader2 } from 'lucide-react';
import { cities, specialties } from '../lib/mock-data';

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialty: '',
    city: '',
    address: '',
    bio: '',
    education: '',
    license: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
    
    if (!formData.specialty) {
      newErrors.specialty = 'La spécialité est requise';
    }
    
    if (!formData.city) {
      newErrors.city = 'La ville est requise';
    }
    
    if (!formData.license.trim()) {
      newErrors.license = 'Le numéro de licence est requis';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, acceptTerms, ...userData } = formData;
      const success = await register(userData, 'doctor');
      
      if (success) {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Inscription Médecin" 
      subtitle="Créez votre compte professionnel pour gérer vos rendez-vous"
      type="register"
      role="doctor"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {/* Personal Information */}
          <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
          
          <div>
            <Label htmlFor="name">Nom Complet</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. Nom Prénom"
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Label htmlFor="email">Email Professionnel</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="docteur@exemple.com"
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Mot de passe</Label>
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
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
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
            <Label htmlFor="phone">Téléphone Professionnel</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0600000000"
              className="mt-1"
            />
          </div>
          
          {/* Professional Information */}
          <h3 className="text-lg font-medium text-gray-900 pt-4">Informations professionnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">Spécialité</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => handleSelectChange('specialty', value)}
              >
                <SelectTrigger className={`mt-1 ${errors.specialty ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionnez votre spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
            </div>
            
            <div>
              <Label htmlFor="license">Numéro de Licence</Label>
              <Input
                id="license"
                name="license"
                type="text"
                value={formData.license}
                onChange={handleChange}
                placeholder="123456"
                className={`mt-1 ${errors.license ? 'border-red-500' : ''}`}
              />
              {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Biographie professionnelle</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Décrivez votre parcours et expérience professionnelle..."
              className="mt-1 resize-none"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="education">Formation et qualifications</Label>
            <Textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Listez vos diplômes, certifications et qualifications..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
          
          {/* Location Information */}
          <h3 className="text-lg font-medium text-gray-900 pt-4">Adresse du cabinet</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleSelectChange('city', value)}
              >
                <SelectTrigger className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <Label htmlFor="address">Adresse complète</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Rue Example, Quartier, Ville"
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, acceptTerms: checked as boolean })
              }
              className={errors.acceptTerms ? 'border-red-500' : ''}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                J'accepte les <a href="#" className="text-tbibdaba-teal hover:underline">conditions d'utilisation</a>, la <a href="#" className="text-tbibdaba-teal hover:underline">politique de confidentialité</a> et je certifie être un professionnel de santé légalement autorisé à exercer au Maroc.
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}
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
            'Créer mon compte'
          )}
        </Button>

        <p className="text-center text-sm text-gray-600">
          En vous inscrivant, vous bénéficiez d'un essai gratuit de 30 jours. 
          Découvrez nos <a href="/pricing" className="text-tbibdaba-teal hover:underline">forfaits</a>.
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterDoctor;
