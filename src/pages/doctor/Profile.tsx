import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save, Clock, Upload, MailCheck, BellRing, BellOff, Trash2, FileText, FileCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cities, specialties } from '../../lib/mock-data';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
    education: '',
    city: '',
    address: '',
    consultationPrice: '',
    consultationDuration: '30',
    availableHoursStart: '08:00',
    availableHoursEnd: '18:00',
    workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    emailNotifications: true,
    smsNotifications: true,
    reminderTime: '24',
    licenseNumber: '',
    inpeCode: '',
    councilCard: null as File | null,
    councilCardFilename: '',
    diploma: null as File | null,
    diplomaFilename: '',
    unavailableDates: [] as Date[],
  });

  useEffect(() => {
    // Simulate API call to fetch doctor profile data
    const fetchProfileData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app, this would come from an API
      setProfileData({
        name: user?.name || 'Dr. Utilisateur',
        email: user?.email || 'doctor@example.com',
        phone: '+212 661 234567',
        specialty: 'Cardiologie',
        bio: 'Cardiologue spécialisé dans le diagnostic et le traitement des maladies cardiovasculaires, avec une expertise particulière dans l\'hypertension et les maladies coronariennes.',
        education: 'Doctorat en Médecine, Université Mohammed V, Rabat (2010)\nSpécialisation en Cardiologie, CHU Ibn Sina, Rabat (2015)',
        city: 'Rabat',
        address: '45 Avenue Mohammed V, Rabat',
        consultationPrice: '350',
        consultationDuration: '30',
        availableHoursStart: '08:00',
        availableHoursEnd: '18:00',
        workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        emailNotifications: true,
        smsNotifications: true,
        reminderTime: '24',
        licenseNumber: 'MD12345',
        inpeCode: 'INPE7890',
        councilCard: null,
        councilCardFilename: '',
        diploma: null,
        diplomaFilename: '',
        unavailableDates: [],
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

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      const filenameField = `${name}Filename` as keyof typeof profileData;
      setProfileData(prev => ({
        ...prev,
        [name]: file,
        [filenameField]: file.name
      }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Check if date is already selected
    const isDateSelected = profileData.unavailableDates.some(
      d => d.toDateString() === date.toDateString()
    );
    
    if (isDateSelected) {
      // Remove date
      const newDates = profileData.unavailableDates.filter(
        d => d.toDateString() !== date.toDateString()
      );
      setProfileData(prev => ({ ...prev, unavailableDates: newDates }));
    } else {
      // Add date
      setProfileData(prev => ({
        ...prev,
        unavailableDates: [...prev.unavailableDates, date]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Log file information to console for debugging
    if (profileData.councilCard) {
      console.log('Council Card:', profileData.councilCard.name, profileData.councilCard.type);
    }
    if (profileData.diploma) {
      console.log('Diploma:', profileData.diploma.name, profileData.diploma.type);
    }
    
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
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="practice">Cabinet</TabsTrigger>
            <TabsTrigger value="credentials">Diplômes</TabsTrigger>
            <TabsTrigger value="schedule">Planning</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles et professionnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                      {profileData.name.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{profileData.name}</h3>
                      <p className="text-sm text-gray-500">{profileData.specialty}</p>
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
                      <Label htmlFor="specialty">Spécialité</Label>
                      <Select
                        value={profileData.specialty}
                        onValueChange={(value) => handleSelectChange('specialty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map(specialty => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie professionnelle</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                    <p className="text-sm text-gray-500">
                      Décrivez votre parcours professionnel et vos spécialités
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Formation et qualifications</Label>
                    <Textarea
                      id="education"
                      name="education"
                      value={profileData.education}
                      onChange={handleInputChange}
                      rows={3}
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

          <TabsContent value="practice">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations du cabinet</CardTitle>
                  <CardDescription>
                    Configurez les informations relatives à votre pratique
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                      <Label htmlFor="address">Adresse complète</Label>
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
                      <Label htmlFor="consultationPrice">Prix de consultation (MAD)</Label>
                      <Input
                        id="consultationPrice"
                        name="consultationPrice"
                        type="number"
                        value={profileData.consultationPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationDuration">Durée de consultation (minutes)</Label>
                      <Select
                        value={profileData.consultationDuration}
                        onValueChange={(value) => handleSelectChange('consultationDuration', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Durée de consultation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="20">20 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
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

          <TabsContent value="credentials">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Diplômes et accréditations</CardTitle>
                  <CardDescription>
                    Ajoutez vos diplômes et informations d'accréditation professionnelle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Numéro de licence</Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        value={profileData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="Ex: MD12345"
                        aria-label="Numéro de licence"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inpeCode">Code INPE</Label>
                      <Input
                        id="inpeCode"
                        name="inpeCode"
                        value={profileData.inpeCode}
                        onChange={handleInputChange}
                        placeholder="Ex: INPE7890"
                        aria-label="Code INPE"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="councilCard">Carte du conseil de l'Ordre</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="councilCard"
                          type="file"
                          className="hidden"
                          aria-label="Télécharger une carte du conseil de l'Ordre"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange('councilCard', file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('councilCard')?.click()}
                          className="flex-1"
                          aria-label="Sélectionner un fichier pour la carte du conseil"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {profileData.councilCardFilename ? 'Changer de fichier' : 'Télécharger'}
                        </Button>
                        {profileData.councilCardFilename && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setProfileData(prev => ({
                                ...prev,
                                councilCard: null,
                                councilCardFilename: ''
                              }));
                            }}
                            aria-label="Supprimer le fichier"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {profileData.councilCardFilename && (
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <FileCheck className="h-4 w-4 mr-1" />
                          {profileData.councilCardFilename}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Formats acceptés: PDF, JPG ou PNG. Taille max: 5MB
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diploma">Diplôme médical</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="diploma"
                          type="file"
                          className="hidden"
                          aria-label="Télécharger un diplôme médical"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange('diploma', file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('diploma')?.click()}
                          className="flex-1"
                          aria-label="Sélectionner un fichier pour le diplôme"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {profileData.diplomaFilename ? 'Changer de fichier' : 'Télécharger'}
                        </Button>
                        {profileData.diplomaFilename && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setProfileData(prev => ({
                                ...prev,
                                diploma: null,
                                diplomaFilename: ''
                              }));
                            }}
                            aria-label="Supprimer le fichier"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {profileData.diplomaFilename && (
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <FileCheck className="h-4 w-4 mr-1" />
                          {profileData.diplomaFilename}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Formats acceptés: PDF, JPG ou PNG. Taille max: 5MB
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Accréditations supplémentaires</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Ajoutez d'autres certifications ou accréditations pertinentes pour votre pratique.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline"
                      aria-label="Ajouter une accréditation"
                    >
                      Ajouter une accréditation
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
                        Enregistrer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Planning de disponibilité</CardTitle>
                  <CardDescription>
                    Configurez vos heures et jours de travail
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Heures de travail</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-1/2">
                          <Label htmlFor="availableHoursStart" className="sr-only">
                            Début
                          </Label>
                          <Input
                            id="availableHoursStart"
                            name="availableHoursStart"
                            type="time"
                            value={profileData.availableHoursStart}
                            onChange={handleInputChange}
                          />
                        </div>
                        <span>à</span>
                        <div className="w-1/2">
                          <Label htmlFor="availableHoursEnd" className="sr-only">
                            Fin
                          </Label>
                          <Input
                            id="availableHoursEnd"
                            name="availableHoursEnd"
                            type="time"
                            value={profileData.availableHoursEnd}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lunchBreak">Pause déjeuner</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-1/2">
                          <Input
                            id="lunchBreakStart"
                            type="time"
                            defaultValue="12:00"
                          />
                        </div>
                        <span>à</span>
                        <div className="w-1/2">
                          <Input
                            id="lunchBreakEnd"
                            type="time"
                            defaultValue="14:00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Jours de travail</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Switch
                            id={day}
                            checked={profileData.workingDays.includes(day)}
                            onCheckedChange={(checked) => {
                              const newWorkingDays = checked 
                                ? [...profileData.workingDays, day] 
                                : profileData.workingDays.filter(d => d !== day);
                              setProfileData({ ...profileData, workingDays: newWorkingDays });
                            }}
                          />
                          <label
                            htmlFor={day}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Bloquer des dates</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Sélectionnez les dates pendant lesquelles vous ne serez pas disponible (congés, formations, etc.)
                      </p>
                      
                      <div className="mb-4">
                        <Label>Dates bloquées</Label>
                        <Calendar
                          mode="multiple"
                          selected={profileData.unavailableDates}
                          onSelect={(dates) => {
                            if (Array.isArray(dates)) {
                              setProfileData(prev => ({...prev, unavailableDates: dates}));
                            }
                          }}
                          className="rounded-md border mt-2 bg-popover pointer-events-auto z-50"
                          disabled={(date) => {
                            // Disable dates in the past
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </div>
                      
                      {profileData.unavailableDates.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Dates sélectionnées :</h4>
                          <div className="flex flex-wrap gap-2">
                            {profileData.unavailableDates.map((date, index) => (
                              <div 
                                key={index} 
                                className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                              >
                                {date.toLocaleDateString('fr-FR')}
                                <button
                                  type="button"
                                  className="ml-2 text-gray-500 hover:text-red-500"
                                  onClick={() => {
                                    const newDates = profileData.unavailableDates.filter(
                                      (_, i) => i !== index
                                    );
                                    setProfileData(prev => ({
                                      ...prev,
                                      unavailableDates: newDates
                                    }));
                                  }}
                                  aria-label="Supprimer cette date"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                          <MailCheck className="h-5 w-5 text-green-500" />
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

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Paramètres des rappels</h3>
                    <div className="space-y-2">
                      <Label htmlFor="reminderTime">Envoyer un rappel</Label>
                      <Select
                        value={profileData.reminderTime}
                        onValueChange={(value) => handleSelectChange('reminderTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le délai" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 heure avant</SelectItem>
                          <SelectItem value="3">3 heures avant</SelectItem>
                          <SelectItem value="12">12 heures avant</SelectItem>
                          <SelectItem value="24">1 jour avant</SelectItem>
                          <SelectItem value="48">2 jours avant</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Temps à l'avance pour envoyer les rappels de rendez-vous aux patients
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Modèles de messages</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="confirmationTemplate">Message de confirmation</Label>
                        <Textarea
                          id="confirmationTemplate"
                          defaultValue="Votre rendez-vous avec [Doctor Name] est confirmé pour le [Date] à [Time]. Pour annuler ou reprogrammer, veuillez nous contacter au moins 24 heures à l'avance."
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reminderTemplate">Message de rappel</Label>
                        <Textarea
                          id="reminderTemplate"
                          defaultValue="Rappel: Vous avez un rendez-vous avec [Doctor Name] demain à [Time]. Veuillez arriver 10 minutes à l'avance. Merci."
                          rows={3}
                        />
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
