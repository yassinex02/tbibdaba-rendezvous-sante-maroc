
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

interface RescheduleFormProps {
  appointmentId: string;
  doctorName: string;
  currentDate: string;
  currentTime: string;
  availableSlots: string[];
  onSubmit: (appointmentId: string, newDate: string, newTime: string) => void;
  onCancel: () => void;
}

const RescheduleForm = ({
  appointmentId,
  doctorName,
  currentDate,
  currentTime,
  availableSlots,
  onSubmit,
  onCancel
}: RescheduleFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Format the dates for display
  const formatDateForDisplay = (date: Date) => {
    return format(date, 'PPP', { locale: fr });
  };
  
  // Determine if a given date should be disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates and today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Store the rescheduled appointment in localStorage for demo purposes
      try {
        // First get existing appointments
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Find and update the specific appointment
        const updatedAppointments = existingAppointments.map((apt: any) => {
          if (apt.id === appointmentId || (apt.doctorName === doctorName && apt.time === currentTime)) {
            return {
              ...apt,
              date: formattedDate,
              time: selectedTime,
              rescheduled: true
            };
          }
          return apt;
        });
        
        // Save back to localStorage
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        console.log('Appointment rescheduled:', {
          appointmentId,
          newDate: formattedDate,
          newTime: selectedTime
        });
        
        // Show success message
        toast({
          title: "Rendez-vous reprogrammé",
          description: `Votre rendez-vous a été reprogrammé pour le ${formatDateForDisplay(selectedDate)} à ${selectedTime}`,
          variant: "default",
        });
        
        // Call the onSubmit function provided by the parent component
        onSubmit(appointmentId, formattedDate, selectedTime);
      } catch (error) {
        console.error('Error rescheduling appointment:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la reprogrammation du rendez-vous",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner une date et un horaire",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Reprogrammer le rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm text-gray-500 mb-2">Rendez-vous actuel</div>
            <div className="font-medium">{doctorName}</div>
            <div className="flex items-center mt-2 text-sm">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center mt-1 text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{currentTime}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Nouvelle date
            </label>
            <div className="mx-auto"> {/* Center the calendar */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border bg-popover p-3"
                aria-label="Sélectionner une nouvelle date"
              />
            </div>
          </div>
          
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Nouvel horaire
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    variant={selectedTime === slot ? "default" : "outline"}
                    className={selectedTime === slot ? "bg-tbibdaba-teal" : ""}
                    onClick={() => setSelectedTime(slot)}
                    aria-label={`Sélectionner l'horaire ${slot}`}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {selectedDate && selectedTime && (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-sm text-gray-500 mb-2">Nouveau rendez-vous</div>
              <div className="font-medium">{doctorName}</div>
              <div className="flex items-center mt-2 text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>{formatDateForDisplay(selectedDate)}</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>{selectedTime}</span>
              </div>
              
              <div className="flex items-center justify-center my-3 text-gray-400">
                <ArrowRight className="h-5 w-5" />
              </div>
              
              <p className="text-sm text-gray-600">
                En confirmant, votre rendez-vous actuel sera annulé et remplacé par cette nouvelle date et heure.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          aria-label="Annuler"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime}
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
          aria-label="Confirmer le nouveau rendez-vous"
        >
          Confirmer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RescheduleForm;
