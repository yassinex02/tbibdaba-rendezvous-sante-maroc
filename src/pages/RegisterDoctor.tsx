
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
import { Loader2, Upload } from 'lucide-react';
import { cities, specialties } from '../lib/mock-data';
import RequiredFieldLabel from '../components/RequiredFieldLabel';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    inpeCode: '',
    acceptTerms: false,
    // New fields
    licenseDocument: null as File | null,
    identityDocument: null as File | null,
    diplomaDocument: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
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
    
    if (!formData.inpeCode.trim()) {
      newErrors.inpeCode = 'Le code INPE est requis';
    }
    
    if (!formData.licenseDocument) {
      newErrors.licenseDocument = 'La copie de votre carte du Conseil de l\'ordre est requise';
    }
    
    if (!formData.identityDocument) {
      newErrors.identityDocument = 'Une pièce d\'identité est requise';
    }
    
    if (!formData.diplomaDocument) {
      newErrors.diplomaDocument = 'Une copie de vos diplômes est requise';
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
      const { confirmPassword, acceptTerms, licenseDocument, identityDocument, diplomaDocument, ...userData } = formData;
      
      // In a real app, you would upload the documents and include their URLs
      // For now, we'll just simulate the document upload
      const success = await register(userData, 'doctor');
      
      if (success) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé et est en attente de vérification. Vous recevrez un email lorsque votre compte sera activé.",
        });
        navigate('/doctor/dashboard');
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

  // Enhanced specialties list including Dentistry
  const enhancedSpecialties = [
    ...specialties,
    'Dentiste',
    'Chirurgien-dentiste',
    'Orthodontiste',
    'Pédodontiste'
  ].sort();

  return (
    <AuthLayout 
      title="Inscription Médecin" 
      subtitle="Créez votre compte professionnel pour gérer vos rendez-vous"
      type="register"
      role="doctor"
    >
      <Alert className="mt-4 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle>Processus de vérification</AlertTitle>
        <AlertDescription>
          Votre compte sera soumis à vérification par notre équipe avant d'être activé. Veuillez fournir des documents valides.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {/* Personal Information */}
          <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
          
          <div>
            <RequiredFieldLabel>Nom Complet</RequiredFieldLabel>
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
            <RequiredFieldLabel>Email Professionnel</RequiredFieldLabel>
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
            <RequiredFieldLabel>Téléphone Professionnel</RequiredFieldLabel>
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
              <RequiredFieldLabel>Spécialité</RequiredFieldLabel>
              <Select
                value={formData.specialty}
                onValueChange={(value) => handleSelectChange('specialty', value)}
              >
                <SelectTrigger className={`mt-1 ${errors.specialty ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionnez votre spécialité" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {enhancedSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
            </div>
            
            <div>
              <RequiredFieldLabel>Numéro de Licence</RequiredFieldLabel>
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
            <RequiredFieldLabel>Code INPE</RequiredFieldLabel>
            <Input
              id="inpeCode"
              name="inpeCode"
              type="text"
              value={formData.inpeCode}
              onChange={handleChange}
              placeholder="Votre code INPE"
              className={`mt-1 ${errors.inpeCode ? 'border-red-500' : ''}`}
            />
            {errors.inpeCode && <p className="text-red-500 text-xs mt-1">{errors.inpeCode}</p>}
            <p className="text-xs text-gray-500 mt-1">Le code d'Identifiant National des Professionnels de la Santé</p>
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
          
          {/* Document Upload Section */}
          <h3 className="text-lg font-medium text-gray-900 pt-4">Documents de vérification</h3>
          
          <div className="space-y-4">
            <div>
              <RequiredFieldLabel>Carte du Conseil de l'ordre</RequiredFieldLabel>
              <div className="mt-1 flex items-center gap-4">
                <Input
                  id="licenseDocument"
                  name="licenseDocument"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className={`mt-1 ${errors.licenseDocument ? 'border-red-500' : ''}`}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
              {errors.licenseDocument && <p className="text-red-500 text-xs mt-1">{errors.licenseDocument}</p>}
            </div>
            
            <div>
              <RequiredFieldLabel>Diplôme(s)</RequiredFieldLabel>
              <div className="mt-1 flex items-center gap-4">
                <Input
                  id="diplomaDocument"
                  name="diplomaDocument"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className={`mt-1 ${errors.diplomaDocument ? 'border-red-500' : ''}`}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
              {errors.diplomaDocument && <p className="text-red-500 text-xs mt-1">{errors.diplomaDocument}</p>}
            </div>
            
            <div>
              <RequiredFieldLabel>Pièce d'identité</RequiredFieldLabel>
              <div className="mt-1 flex items-center gap-4">
                <Input
                  id="identityDocument"
                  name="identityDocument"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className={`mt-1 ${errors.identityDocument ? 'border-red-500' : ''}`}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
              {errors.identityDocument && <p className="text-red-500 text-xs mt-1">{errors.identityDocument}</p>}
            </div>
          </div>
          
          {/* Location Information */}
          <h3 className="text-lg font-medium text-gray-900 pt-4">Adresse du cabinet</h3>
          
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
                J'accepte les <a href="#" className="text-tbibdaba-teal hover:underline">conditions d'utilisation</a>, la <a href="#" className="text-tbibdaba-teal hover:underline">politique de confidentialité</a> et je certifie être un professionnel de santé légalement autorisé à exercer au Maroc. <span className="text-red-500">*</span>
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
        
        <p className="text-center text-xs text-gray-500 mt-4">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterDoctor;
