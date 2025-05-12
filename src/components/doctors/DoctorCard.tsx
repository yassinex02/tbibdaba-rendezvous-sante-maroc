
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Calendar, Star, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  availableDays: string[];
  timeSlots: string[];
  acceptedInsurance?: string[];
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
}

const DoctorCard = ({ doctor, onBookAppointment, onViewProfile }: DoctorCardProps) => {
  // Find the next available slot (first item in timeSlots)
  const nextAvailableSlot = doctor.timeSlots[0];
  
  // Get doctor's initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="doctor-card border rounded-lg shadow-sm mb-4 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-auto mb-4 md:mb-0 md:mr-6">
            <Avatar className="w-32 h-32 rounded-md">
              <AvatarImage
                src={doctor.image || "/placeholder.svg"} 
                alt={`Dr. ${doctor.name}`}
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <AvatarFallback className="text-xl bg-tbibdaba-light text-tbibdaba-teal w-32 h-32 rounded-md">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div>
                <h3 className="doctor-name text-lg font-semibold group-hover:text-tbibdaba-teal transition-colors">
                  {doctor.name}
                </h3>
                <p className="doctor-specialty text-gray-600">{doctor.specialty}</p>
                
                <Badge variant="outline" className="mt-1 mb-3 bg-tbibdaba-light/50 text-tbibdaba-teal border-tbibdaba-teal/30">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Prochain créneau: {nextAvailableSlot}</span>
                  </div>
                </Badge>
                
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
                  className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 transition-all hover:scale-105"
                  onClick={() => onBookAppointment(doctor)}
                >
                  Prendre rendez-vous
                </Button>
                {onViewProfile && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewProfile(doctor)}
                  >
                    Voir profil
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
              <div className="doctor-location flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium text-gray-700">{doctor.city}</span>
                <span className="ml-1 text-gray-500">{doctor.address}</span>
              </div>
              <div className="doctor-location flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.phone}</span>
              </div>
              <div className="doctor-location flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.availableDays.join(', ')}</span>
              </div>
              <div className="doctor-location flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.timeSlots[0]} - {doctor.timeSlots[doctor.timeSlots.length - 1]}</span>
              </div>
            </div>
            
            {/* Insurance information */}
            {doctor.acceptedInsurance && doctor.acceptedInsurance.length > 0 && (
              <div className="mt-3 border-t pt-3 border-gray-100">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-tbibdaba-teal/70" />
                  <span className="text-sm font-medium text-gray-700">
                    Assurances acceptées:
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {doctor.acceptedInsurance.map((insurance, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {insurance}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
