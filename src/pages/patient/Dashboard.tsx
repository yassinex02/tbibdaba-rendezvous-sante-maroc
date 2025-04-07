
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, Star, PlusCircle, Loader2 } from 'lucide-react';
import { appointments } from '../../lib/mock-data';

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

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    confirmed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  const statusLabels = {
    confirmed: 'Confirmé',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };
  
  const style = statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[status as keyof typeof statusLabels] || status;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Simulate API call to fetch appointments
    const fetchAppointments = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter appointments by status
      const upcoming = appointments.filter(
        appt => appt.status === 'confirmed' || appt.status === 'pending'
      );
      
      const past = appointments.filter(
        appt => appt.status === 'completed' || appt.status === 'cancelled'
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setIsLoading(false);
    };
    
    fetchAppointments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bonjour, {user?.name}</h1>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace patient
            </p>
          </div>
          <Button onClick={() => navigate('/patient/search')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-tbibdaba-light border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Trouvez un médecin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Recherchez parmi nos nombreux spécialistes pour trouver le médecin qui vous convient.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
                onClick={() => navigate('/patient/search')}
              >
                Rechercher
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-blue-50 border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Gérez vos consultations à venir et consultez l'historique de vos visites.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate('/patient/appointments')}
              >
                Voir tous
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-purple-50 border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mon profil médical</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Mettez à jour vos informations personnelles et médicales.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/patient/profile')}
              >
                Modifier
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Rendez-vous à venir</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <StatusBadge status={appointment.status} />
                          <span className="ml-2 text-sm text-gray-500">{appointment.type}</span>
                        </div>
                        <h3 className="text-lg font-medium mb-1">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-500 mb-2">{appointment.specialty}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-gray-500">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline">
                          Reprogrammer
                        </Button>
                        <Button size="sm" variant="destructive">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/patient/appointments')}>
                  Voir tous les rendez-vous
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">Aucun rendez-vous à venir</h3>
                <p className="text-gray-500 text-center mb-4">
                  Vous n'avez pas de rendez-vous programmés. Prenez un rendez-vous avec un médecin.
                </p>
                <Button onClick={() => navigate('/patient/search')}>
                  Trouver un médecin
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Medical History Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Historique récent</h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
              </div>
            ) : pastAppointments.length > 0 ? (
              <Card>
                <CardContent className="p-6">
                  {pastAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="py-4 border-b last:border-0 border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {formatDate(appointment.date)} • {appointment.time}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Aucun historique</h3>
                  <p className="text-gray-500 text-center">
                    Votre historique de rendez-vous apparaîtra ici.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Médecins recommandés</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Dr. Yasmine Benali" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Dr. Yasmine Benali</h4>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Cardiologie</p>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        Casablanca
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Dr. Omar Kadiri" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">Dr. Omar Kadiri</h4>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Pédiatrie</p>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        Rabat
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => navigate('/patient/search')}
                >
                  Voir plus de médecins
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
