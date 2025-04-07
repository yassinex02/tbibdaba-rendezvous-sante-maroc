
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, Phone, FileText, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';
import { appointments } from '../../lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  type: string;
  notes?: string;
}

const AppointmentCard = ({ appointment, onCancel }: { 
  appointment: Appointment;
  onCancel: (id: string) => void;
}) => {
  const statusIcons = {
    confirmed: <Clock className="h-5 w-5 text-blue-500" />,
    pending: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    cancelled: <X className="h-5 w-5 text-red-500" />,
  };

  const statusLabels = {
    confirmed: 'Confirmé',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isPast = new Date(appointment.date) < new Date() || 
                appointment.status === 'completed' || 
                appointment.status === 'cancelled';

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              {statusIcons[appointment.status as keyof typeof statusIcons]}
              <div className="ml-4">
                <h3 className="text-lg font-medium">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>Cabinet du médecin</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>+212 522 123456</span>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="mt-3 text-sm text-gray-600 flex items-start">
                <FileText className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <span>{appointment.notes}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="mb-auto">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {statusLabels[appointment.status as keyof typeof statusLabels]}
              </span>
            </div>
            
            {!isPast && appointment.status !== 'cancelled' && (
              <div className="mt-4 space-y-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full md:w-auto"
                >
                  Reprogrammer
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full md:w-auto"
                  onClick={() => onCancel(appointment.id)}
                >
                  Annuler
                </Button>
              </div>
            )}
            
            {isPast && appointment.status === 'completed' && (
              <Button variant="outline" size="sm" className="mt-4">
                Donner un avis
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PatientAppointments = () => {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    const fetchAppointments = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAllAppointments(appointments);
      
      // Filter upcoming and past appointments
      const now = new Date();
      const upcoming = appointments.filter(
        appt => (new Date(appt.date) >= now && appt.status !== 'cancelled') || 
        (appt.status === 'pending')
      );
      
      const past = appointments.filter(
        appt => (new Date(appt.date) < now || appt.status === 'completed' || appt.status === 'cancelled')
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setIsLoading(false);
    };
    
    fetchAppointments();
  }, []);

  // Filter appointments by selected date
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      const filtered = allAppointments.filter(appt => appt.date === dateString);
      
      const upcoming = filtered.filter(
        appt => appt.status === 'confirmed' || appt.status === 'pending'
      );
      
      const past = filtered.filter(
        appt => appt.status === 'completed' || appt.status === 'cancelled'
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } else {
      // Reset to all appointments
      const now = new Date();
      const upcoming = allAppointments.filter(
        appt => (new Date(appt.date) >= now && appt.status !== 'cancelled') || 
        (appt.status === 'pending')
      );
      
      const past = allAppointments.filter(
        appt => (new Date(appt.date) < now || appt.status === 'completed' || appt.status === 'cancelled')
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    }
  }, [selectedDate, allAppointments]);

  const handleCancelAppointment = (id: string) => {
    // In a real app, this would call an API to cancel the appointment
    const updatedAppointments = allAppointments.map(appt => 
      appt.id === id ? { ...appt, status: 'cancelled' } : appt
    );
    
    setAllAppointments(updatedAppointments);
    
    // Update upcoming and past lists
    const updatedUpcoming = upcomingAppointments.filter(appt => appt.id !== id);
    const cancelledAppointment = allAppointments.find(appt => appt.id === id);
    
    if (cancelledAppointment) {
      const updatedCancelled = { ...cancelledAppointment, status: 'cancelled' };
      setPastAppointments([...pastAppointments, updatedCancelled]);
    }
    
    setUpcomingAppointments(updatedUpcoming);
    
    toast({
      title: "Rendez-vous annulé",
      description: "Votre rendez-vous a été annulé avec succès.",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mes Rendez-vous</h1>
            <p className="text-muted-foreground">
              Consultez et gérez tous vos rendez-vous médicaux
            </p>
          </div>
          <Button onClick={() => navigate('/patient/search')}>
            Nouveau rendez-vous
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="past">Passés</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onCancel={handleCancelAppointment}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-1">
                        {selectedDate ? 'Pas de rendez-vous à cette date' : 'Aucun rendez-vous à venir'}
                      </h3>
                      <p className="text-gray-500 text-center mb-4">
                        {selectedDate ? 
                          'Essayez une autre date ou annulez le filtre de date' : 
                          'Vous n\'avez pas de rendez-vous programmés prochainement'}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/patient/search')}
                      >
                        Trouver un médecin
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
                  </div>
                ) : pastAppointments.length > 0 ? (
                  pastAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onCancel={handleCancelAppointment}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-1">
                        {selectedDate ? 'Pas de rendez-vous passés à cette date' : 'Aucun rendez-vous passé'}
                      </h3>
                      <p className="text-gray-500 text-center">
                        {selectedDate ? 
                          'Essayez une autre date ou annulez le filtre de date' : 
                          'Votre historique de rendez-vous apparaîtra ici'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Filtrer par date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                
                {selectedDate && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Effacer le filtre
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Besoin d'aide?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Si vous avez des questions ou rencontrez des problèmes avec vos rendez-vous, notre équipe est là pour vous aider.
                </p>
                <Button variant="outline" className="w-full">
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
