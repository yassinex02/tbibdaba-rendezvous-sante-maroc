
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Upload, BellRing, BellOff, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cities } from '../../lib/mock-data';

const PatientProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    gender: '',
    city: '',
    address: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
    emergencyContact: '',
    emergencyPhone: '',
    emailNotifications: true,
    smsNotifications: true,
  });

  useEffect(() => {
    // Simulate API call to fetch profile data
    const fetchProfileData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app, this would come from an API
      setProfileData({
        name: user?.name || 'Mohamed Alami',
        email: user?.email || 'patient@example.com',
        phone: '+212 661 123456',
        birthdate: '1985-05-15',
        gender: 'male',
        city: 'Casablanca',
        address: '123 Rue Mohammed V, Casablanca',
        bloodType: 'O+',
        allergies: 'Pénicilline, Pollen',
        chronicConditions: 'Hypertension',
        medications: 'Lisinopril 10mg (quotidien)',
        emergencyContact: 'Fatima Alami',
        emergencyPhone: '+212 661 789012',
        emailNotifications: true,
        smsNotifications: true,
      });
      
      setIsLoading(false);
    };
    
    fetchProfileData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfileData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to save profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et médicales
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="medical">Informations médicales</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                      {profileData.name.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{profileData.name}</h3>
                      <p className="text-sm text-gray-500">{profileData.email}</p>
                      <Button type="button" variant="outline" size="sm" className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Changer la photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date de naissance</Label>
                      <Input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        value={profileData.birthdate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Genre</Label>
                    <RadioGroup 
                      value={profileData.gender} 
                      onValueChange={(value) => handleSelectChange('gender', value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Homme</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Femme</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Autre</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Select
                        value={profileData.city}
                        onValueChange={(value) => handleSelectChange('city', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contact d'urgence</Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Téléphone d'urgence</Label>
                      <Input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={profileData.emergencyPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Annuler</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="medical">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations médicales</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations médicales pour aider les médecins lors de vos consultations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Groupe sanguin</Label>
                      <Select
                        value={profileData.bloodType}
                        onValueChange={(value) => handleSelectChange('bloodType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={profileData.allergies}
                      onChange={handleInputChange}
                      placeholder="Listez vos allergies connues (médicaments, aliments, etc.)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chronicConditions">Maladies chroniques</Label>
                    <Textarea
                      id="chronicConditions"
                      name="chronicConditions"
                      value={profileData.chronicConditions}
                      onChange={handleInputChange}
                      placeholder="Listez vos conditions médicales chroniques"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Médicaments actuels</Label>
                    <Textarea
                      id="medications"
                      name="medications"
                      value={profileData.medications}
                      onChange={handleInputChange}
                      placeholder="Listez les médicaments que vous prenez actuellement"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Annuler</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Gérez vos informations de sécurité et de connexion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Entrez votre mot de passe actuel"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Entrez un nouveau mot de passe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirmez votre nouveau mot de passe"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Sessions actives</h3>
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Appareil actuel</p>
                          <p className="text-sm text-gray-500">Chrome • Casablanca, Maroc</p>
                        </div>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Actif maintenant
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full flex items-center" size="sm">
                      <Lock className="mr-2 h-4 w-4" />
                      Déconnecter toutes les autres sessions
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Annuler</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Mettre à jour le mot de passe
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-red-600">Zone de danger</CardTitle>
                <CardDescription>
                  Actions qui peuvent affecter de manière permanente votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <Button variant="destructive" type="button">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer mon compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Paramètres de notification</CardTitle>
                  <CardDescription>
                    Configurez comment et quand vous souhaitez être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications par email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevez des emails concernant vos rendez-vous et activités
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="email-notifications"
                          checked={profileData.emailNotifications}
                          onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                        />
                        {profileData.emailNotifications ? (
                          <BellRing className="h-5 w-5 text-green-500" />
                        ) : (
                          <BellOff className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications par SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevez des SMS pour les rappels de rendez-vous
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sms-notifications"
                          checked={profileData.smsNotifications}
                          onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                        />
                        {profileData.smsNotifications ? (
                          <BellRing className="h-5 w-5 text-green-500" />
                        ) : (
                          <BellOff className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Types de notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Rappels de rendez-vous</Label>
                          <p className="text-sm text-muted-foreground">
                            Recevez un rappel avant vos rendez-vous programmés
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Changements de rendez-vous</Label>
                          <p className="text-sm text-muted-foreground">
                            Soyez notifié si un rendez-vous est modifié ou annulé
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Nouveaux médecins</Label>
                          <p className="text-sm text-muted-foreground">
                            Recevez des notifications quand de nouveaux médecins s'inscrivent dans votre ville
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Offres et promotions</Label>
                          <p className="text-sm text-muted-foreground">
                            Recevez des informations sur les offres spéciales et promotions
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Annuler</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
