
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Filter, 
  Star, 
  Calendar as CalendarIcon, 
  Loader2 
} from 'lucide-react';
import { doctors, specialties, cities } from '../../lib/mock-data';
import { toast } from "@/components/ui/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  city: string;
  address: string;
  phone: string;
  image: string;
  rating: number;
  reviewCount: number;
  about: string;
  education: { degree: string; institution: string; year: string }[];
  availableDays: string[];
  timeSlots: string[];
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  return (
    <Card className="mb-4 card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-auto mb-4 md:mb-0 md:mr-6">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-full md:w-32 md:h-32 rounded-md object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div>
                <h3 className="text-lg font-medium">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
                
                <div className="flex items-center mt-1 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? 'fill-current' : 'fill-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {doctor.rating} ({doctor.reviewCount} avis)
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex md:flex-col gap-2 md:items-end">
                <Button 
                  size="sm" 
                  className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
                  onClick={() => onBookAppointment(doctor)}
                >
                  Prendre rendez-vous
                </Button>
                <Button size="sm" variant="outline">
                  Voir profil
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.city}, {doctor.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.availableDays.join(', ')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.timeSlots[0]} - {doctor.timeSlots[doctor.timeSlots.length - 1]}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DoctorProfile = ({ doctor, onClose, onBookAppointment }: { 
  doctor: Doctor; 
  onClose: () => void;
  onBookAppointment: (slot: string) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Map day names to check availability
  const getDayName = (date: Date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
  };
  
  // Disable days when doctor is unavailable
  const isDayAvailable = (date: Date) => {
    const dayName = getDayName(date);
    return doctor.availableDays.includes(dayName);
  };
  
  return (
    <Card className="md:max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{doctor.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <CardDescription>{doctor.specialty}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-start space-x-4 mb-4">
              <img 
                src={doctor.image} 
                alt={doctor.name}
                className="w-24 h-24 rounded-md object-cover" 
              />
              <div>
                <div className="flex items-center mt-1 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? 'fill-current' : 'fill-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {doctor.rating} ({doctor.reviewCount} avis)
                  </span>
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {doctor.city}, {doctor.address}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  {doctor.phone}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">À propos</h3>
              <p className="text-sm text-gray-600">{doctor.about}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Formation</h3>
              <div className="space-y-2">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}, {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Prendre rendez-vous</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Sélectionnez une date:</p>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  // Disable past dates, today, and days when doctor is unavailable
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || !isDayAvailable(date);
                }}
                className="rounded-md border"
              />
            </div>
            
            {selectedDate && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Choisir un créneau horaire:</p>
                <div className="grid grid-cols-3 gap-2">
                  {doctor.timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      size="sm"
                      className={selectedSlot === slot ? "bg-tbibdaba-teal" : ""}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
          disabled={!selectedSlot}
          onClick={() => selectedSlot && onBookAppointment(selectedSlot)}
        >
          Confirmer le rendez-vous
        </Button>
      </CardFooter>
    </Card>
  );
};

const SearchDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  useEffect(() => {
    // Simulate API call
    const fetchDoctors = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFilteredDoctors(doctors);
      setIsLoading(false);
    };
    
    fetchDoctors();
  }, []);
  
  useEffect(() => {
    let result = [...doctors];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term)
      );
    }
    
    // Apply specialty filter
    if (selectedSpecialty) {
      result = result.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    // Apply city filter
    if (selectedCity) {
      result = result.filter(doctor => doctor.city === selectedCity);
    }
    
    setFilteredDoctors(result);
  }, [searchTerm, selectedSpecialty, selectedCity]);
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setSelectedCity('');
  };
  
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  
  const handleConfirmAppointment = (slot: string) => {
    // In a real app, this would call an API to create the appointment
    toast({
      title: "Rendez-vous confirmé",
      description: `Votre rendez-vous avec ${selectedDoctor?.name} a été confirmé.`,
    });
    setSelectedDoctor(null);
    navigate('/patient/appointments');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rechercher un médecin</h1>
          <p className="text-muted-foreground">
            Trouvez le spécialiste qui vous convient et prenez rendez-vous
          </p>
        </div>

        <div className="grid gap-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un médecin par nom ou spécialité..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Select 
                      value={selectedSpecialty} 
                      onValueChange={setSelectedSpecialty}
                    >
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Toutes les spécialités" />
                        </div>
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
                    <Select 
                      value={selectedCity} 
                      onValueChange={setSelectedCity}
                    >
                      <SelectTrigger>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Toutes les villes" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les villes</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleResetFilters}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
              </div>
            ) : selectedDoctor ? (
              <DoctorProfile 
                doctor={selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
                onBookAppointment={handleConfirmAppointment}
              />
            ) : filteredDoctors.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {filteredDoctors.length} {filteredDoctors.length === 1 ? 'médecin trouvé' : 'médecins trouvés'}
                  </p>
                  <Select defaultValue="rating">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Trier par note</SelectItem>
                      <SelectItem value="name">Trier par nom</SelectItem>
                      <SelectItem value="availability">Trier par disponibilité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {filteredDoctors.map(doctor => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    onBookAppointment={handleBookAppointment}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Aucun médecin trouvé</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Aucun médecin ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
                  </p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchDoctors;
