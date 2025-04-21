
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Search, MapPin, Star, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { cities, specialties } from '@/lib/mock-data';
import DoctorCard from '@/components/doctors/DoctorCard';
import { toast } from "@/components/ui/use-toast";
import BookingSteps from '@/components/booking/BookingSteps';
import PaymentStep from '@/components/booking/PaymentStep';
import AvailabilityFilters from '@/components/search/AvailabilityFilters';

// Sample doctor data with consultation price
const doctorsData = [
  {
    id: '1',
    name: 'Dr. Fatima Zahra',
    specialty: 'Cardiologie',
    city: 'Casablanca',
    address: '123 Boulevard Mohammed V',
    phone: '+212 522 123 456',
    image: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 127,
    about: 'Cardiologue avec plus de 15 ans d\'expérience. Spécialisée dans les maladies cardiaques congénitales et l\'hypertension.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Casablanca', year: '2005' },
      { degree: 'Spécialisation en Cardiologie', institution: 'CHU Ibn Rochd', year: '2010' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationPrice: '400 MAD',
    nextAvailable: 'Aujourd\'hui à 14:00',
    cityType: 'urban'
  },
  {
    id: '2',
    name: 'Dr. Youssef Alaoui',
    specialty: 'Pédiatrie',
    city: 'Rabat',
    address: '45 Avenue Mohammed VI',
    phone: '+212 537 456 789',
    image: '/placeholder.svg',
    rating: 4.6,
    reviewCount: 89,
    about: 'Pédiatre spécialisé dans le développement infantile et les soins aux nouveau-nés.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Rabat', year: '2007' },
      { degree: 'Spécialisation en Pédiatrie', institution: 'Hôpital d\'Enfants de Rabat', year: '2012' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Jeudi', 'Samedi'],
    timeSlots: ['09:30', '10:30', '11:30', '15:00', '16:00', '17:00'],
    consultationPrice: '350 MAD',
    nextAvailable: 'Demain à 09:30',
    cityType: 'urban'
  },
  {
    id: '3',
    name: 'Dr. Amina Bennani',
    specialty: 'Dermatologie',
    city: 'Marrakech',
    address: '78 Rue Bab Agnaou',
    phone: '+212 524 789 123',
    image: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 156,
    about: 'Dermatologue spécialisée dans les maladies de la peau et les traitements esthétiques.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Marrakech', year: '2008' },
      { degree: 'Spécialisation en Dermatologie', institution: 'CHU Mohammed VI', year: '2013' }
    ],
    availableDays: ['Mardi', 'Mercredi', 'Vendredi', 'Samedi'],
    timeSlots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
    consultationPrice: '450 MAD',
    nextAvailable: 'Dans 3 jours',
    cityType: 'urban'
  },
  {
    id: '4',
    name: 'Dr. Mohammed Idrissi',
    specialty: 'Médecine générale',
    city: 'Ouarzazate',
    address: '12 Avenue du 20 Août',
    phone: '+212 528 234 567',
    image: '/placeholder.svg',
    rating: 4.5,
    reviewCount: 78,
    about: 'Médecin généraliste avec une approche holistique. Spécialisé dans les soins préventifs et la médecine familiale.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Casablanca', year: '2010' }
    ],
    availableDays: ['Lundi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationPrice: '250 MAD',
    nextAvailable: 'Aujourd\'hui à 15:00',
    cityType: 'rural'
  },
  {
    id: '5',
    name: 'Dr. Nadia Tazi',
    specialty: 'Gynécologie',
    city: 'Fès',
    address: '56 Boulevard Hassan II',
    phone: '+212 535 345 678',
    image: '/placeholder.svg',
    rating: 4.7,
    reviewCount: 113,
    about: 'Gynécologue obstétricienne spécialisée dans les grossesses à risque et la procréation médicalement assistée.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Fès', year: '2006' },
      { degree: 'Spécialisation en Gynécologie', institution: 'CHU Hassan II', year: '2011' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:30', '15:30', '16:30'],
    consultationPrice: '400 MAD',
    nextAvailable: 'Dans 2 jours',
    cityType: 'urban'
  },
  {
    id: '6',
    name: 'Dr. Hassan Chaoui',
    specialty: 'Orthopédie',
    city: 'Agadir',
    address: '34 Rue des Orangers',
    phone: '+212 528 876 543',
    image: '/placeholder.svg',
    rating: 4.4,
    reviewCount: 67,
    about: 'Chirurgien orthopédiste spécialisé dans les traumatismes sportifs et la chirurgie du genou.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Rabat', year: '2009' },
      { degree: 'Spécialisation en Orthopédie', institution: 'CHU Ibn Sina', year: '2015' }
    ],
    availableDays: ['Lundi', 'Mercredi', 'Samedi'],
    timeSlots: ['10:00', '11:00', '12:00', '15:00', '16:00'],
    consultationPrice: '500 MAD',
    nextAvailable: 'Dans 4 jours',
    cityType: 'urban'
  },
  {
    id: '7',
    name: 'Dr. Sara Bahja',
    specialty: 'Psychiatrie',
    city: 'Tanger',
    address: '98 Boulevard Pasteur',
    phone: '+212 539 987 654',
    image: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 95,
    about: 'Psychiatre spécialisée dans les troubles anxieux et dépressifs. Approche thérapeutique intégrative.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Rabat', year: '2008' },
      { degree: 'Spécialisation en Psychiatrie', institution: 'CHU Arrazi', year: '2013' }
    ],
    availableDays: ['Mardi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:30', '12:00', '15:00', '16:30'],
    consultationPrice: '450 MAD',
    nextAvailable: 'Dans 2 jours',
    cityType: 'urban'
  },
  {
    id: '8',
    name: 'Dr. Karim Najib',
    specialty: 'Ophtalmologie',
    city: 'Meknès',
    address: '23 Avenue des FAR',
    phone: '+212 535 123 456',
    image: '/placeholder.svg',
    rating: 4.6,
    reviewCount: 74,
    about: 'Ophtalmologue spécialisé dans la chirurgie réfractive et la cataracte. Utilise les dernières technologies en matière de soins oculaires.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Fès', year: '2007' },
      { degree: 'Spécialisation en Ophtalmologie', institution: 'CHU Hassan II', year: '2012' }
    ],
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    consultationPrice: '400 MAD',
    nextAvailable: 'Aujourd\'hui à 16:00',
    cityType: 'urban'
  },
  {
    id: '9',
    name: 'Dr. Rachid Moussaoui',
    specialty: 'Médecine générale',
    city: 'Azrou',
    address: '5 Rue principale',
    phone: '+212 535 567 890',
    image: '/placeholder.svg',
    rating: 4.2,
    reviewCount: 45,
    about: 'Médecin de famille dévoué aux communautés rurales. Pratique une approche préventive et holistique.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Fès', year: '2012' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeSlots: ['08:30', '09:30', '10:30', '14:00', '15:00', '16:00'],
    consultationPrice: '200 MAD',
    nextAvailable: 'Demain à 08:30',
    cityType: 'rural'
  },
  {
    id: '10',
    name: 'Dr. Leila Mansouri',
    specialty: 'Endocrinologie',
    city: 'Oujda',
    address: '67 Boulevard Zerktouni',
    phone: '+212 536 789 012',
    image: '/placeholder.svg',
    rating: 4.7,
    reviewCount: 83,
    about: 'Endocrinologue spécialisée dans le diabète et les troubles thyroïdiens. Approche personnalisée pour chaque patient.',
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine d\'Oujda', year: '2009' },
      { degree: 'Spécialisation en Endocrinologie', institution: 'CHU Mohammed VI', year: '2014' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:30', '15:30', '16:30'],
    consultationPrice: '350 MAD',
    nextAvailable: 'Dans 3 jours',
    cityType: 'urban'
  }
];

// Add more small towns to the cities array
const additionalCities = [
  'Azrou', 'Ifrane', 'Midelt', 'Sefrou', 'Taounate', 'Taroudant', 'Taza', 'Tiznit',
  'Ouarzazate', 'Errachidia', 'Essaouira', 'Chefchaouen', 'Larache', 'Ksar El Kebir',
  'Tétouan', 'Al Hoceima', 'Nador', 'Berkane', 'Taourirt', 'Guercif'
];

const SearchDoctors = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [showRuralOnly, setShowRuralOnly] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [doctors, setDoctors] = useState(doctorsData);
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  
  // Booking state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Get current date
  const today = new Date();
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter doctors based on search and filters
  useEffect(() => {
    let results = doctors;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(doctor => 
        doctor.name.toLowerCase().includes(term) || 
        doctor.specialty.toLowerCase().includes(term)
      );
    }
    
    if (filterSpecialty) {
      results = results.filter(doctor => doctor.specialty === filterSpecialty);
    }
    
    if (filterCity) {
      results = results.filter(doctor => doctor.city === filterCity);
    }
    
    if (showRuralOnly) {
      results = results.filter(doctor => doctor.cityType === 'rural');
    }
    
    if (availabilityFilter) {
      // Add availability filtering logic
      switch(availabilityFilter) {
        case 'today':
          results = results.filter(doctor => doctor.nextAvailable.includes('Aujourd\'hui'));
          break;
        case 'tomorrow':
          results = results.filter(doctor => doctor.nextAvailable.includes('Demain'));
          break;
        case 'thisWeek':
          results = results.filter(doctor => 
            doctor.nextAvailable.includes('Aujourd\'hui') || 
            doctor.nextAvailable.includes('Demain') || 
            (doctor.nextAvailable.includes('Dans') && parseInt(doctor.nextAvailable.split(' ')[1]) <= 6)
          );
          break;
        default:
          break;
      }
    }
    
    setFilteredDoctors(results);
  }, [doctors, searchTerm, filterSpecialty, filterCity, showRuralOnly, availabilityFilter]);

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingStep(1);
    setIsBookingOpen(true);
    setSelectedDate(undefined);
    setSelectedTimeSlot('');
    setBookingConfirmed(false);
  };
  
  const handleContinueBooking = () => {
    if (bookingStep === 1 && (!selectedDate || !selectedTimeSlot)) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner une date et un horaire",
        variant: "destructive"
      });
      return;
    }
    
    if (bookingStep < 3) {
      setBookingStep(prev => prev + 1);
    } else {
      // Final confirmation
      setBookingConfirmed(true);
      
      // Schedule a reminder 2 hours before the appointment
      if (selectedDate && selectedTimeSlot) {
        const appointmentDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
        appointmentDateTime.setHours(hours, minutes);
        
        const reminderTime = new Date(appointmentDateTime);
        reminderTime.setHours(reminderTime.getHours() - 2);
        
        console.log('Reminder scheduled for:', reminderTime);
      }
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        setIsBookingOpen(false);
        // Reset booking state
        setBookingStep(1);
        setSelectedDate(undefined);
        setSelectedTimeSlot('');
        setBookingConfirmed(false);
      }, 3000);
    }
  };
  
  const handleBackBooking = () => {
    if (bookingStep > 1) {
      setBookingStep(prev => prev - 1);
    } else {
      setIsBookingOpen(false);
    }
  };
  
  // Determine if a given date should be disabled
  const isDateDisabled = (date: Date) => {
    if (!selectedDoctor) return true;
    
    // Disable dates in the past
    if (date < today && date.toDateString() !== today.toDateString()) {
      return true;
    }
    
    // Get day of week
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayName = days[date.getDay()];
    
    // Disable if doctor doesn't work on this day
    return !selectedDoctor.availableDays.includes(dayName);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Rechercher un médecin</h1>
        
        <div className="grid gap-6 mb-8">
          {/* Search and filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher un médecin ou spécialité..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les spécialités</SelectItem>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les villes</SelectItem>
                      {[...cities, ...additionalCities].sort().map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <AvailabilityFilters 
                  availabilityFilter={availabilityFilter}
                  setAvailabilityFilter={setAvailabilityFilter}
                  showRuralOnly={showRuralOnly}
                  setShowRuralOnly={setShowRuralOnly}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-gray-500">
                {filteredDoctors.length} {filteredDoctors.length === 1 ? 'résultat trouvé' : 'résultats trouvés'}
              </p>
              
              {filteredDoctors.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">Aucun médecin trouvé</h3>
                  <p className="text-gray-500 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterSpecialty('');
                      setFilterCity('');
                      setShowRuralOnly(false);
                      setAvailabilityFilter('');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard 
                      key={doctor.id}
                      doctor={doctor}
                      onBookAppointment={() => handleBookAppointment(doctor)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {bookingConfirmed ? (
            <div className="text-center py-6">
              <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Rendez-vous confirmé !</h2>
              <p className="text-gray-600 mb-2">
                Votre rendez-vous avec {selectedDoctor?.name} a été programmé avec succès
              </p>
              {selectedDate && selectedTimeSlot && (
                <p className="font-medium">
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {selectedTimeSlot}
                </p>
              )}
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Prendre rendez-vous</DialogTitle>
                <DialogDescription>
                  {selectedDoctor?.name} - {selectedDoctor?.specialty}
                </DialogDescription>
              </DialogHeader>
              
              <BookingSteps currentStep={bookingStep} />
              
              <Tabs value={`step-${bookingStep}`} className="mt-4">
                <TabsContent value="step-1" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Sélectionnez une date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateDisabled}
                      className="rounded-md border"
                    />
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <h3 className="font-medium mb-2">Sélectionnez un horaire</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedDoctor?.timeSlots.map((slot: string) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={selectedTimeSlot === slot ? "default" : "outline"}
                            className={selectedTimeSlot === slot ? "bg-tbibdaba-teal" : ""}
                            onClick={() => setSelectedTimeSlot(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDoctor && (
                    <div className="bg-gray-50 p-3 rounded-md mt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500 text-sm">Prix de consultation</div>
                        <div className="font-medium">{selectedDoctor.consultationPrice}</div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="step-2" className="space-y-4">
                  <PaymentStep />
                </TabsContent>
                
                <TabsContent value="step-3" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Récapitulatif du rendez-vous</h3>
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500">Médecin</div>
                        <div className="font-medium">{selectedDoctor?.name}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500">Spécialité</div>
                        <div>{selectedDoctor?.specialty}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500">Date</div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500">Heure</div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedTimeSlot}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500">Adresse</div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedDoctor?.address}, {selectedDoctor?.city}
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                        <div className="text-gray-500">Prix</div>
                        <div className="font-medium">{selectedDoctor?.consultationPrice}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-700">
                      En confirmant ce rendez-vous, vous acceptez les conditions générales d'utilisation et la politique de confidentialité de TbibDaba.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackBooking}
                >
                  {bookingStep === 1 ? 'Annuler' : 'Retour'}
                </Button>
                <Button
                  type="button"
                  onClick={handleContinueBooking}
                  className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
                >
                  {bookingStep === 3 ? 'Confirmer' : 'Continuer'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default SearchDoctors;
