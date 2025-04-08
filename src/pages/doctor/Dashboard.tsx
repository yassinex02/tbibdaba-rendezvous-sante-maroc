
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Calendar, Users, DollarSign, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doctorAppointments, weeklyStats } from '../../lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const DashboardCard = ({ title, value, description, icon, color }: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isPremium = user?.subscription === 'premium' || user?.subscription === 'enterprise';

  const handleCreateAppointment = () => {
    navigate('/doctor/appointments/new');
    toast({
      title: "Créer un rendez-vous",
      description: "Fonctionnalité en cours de développement",
    });
  };

  useEffect(() => {
    // Simulate API call
    const fetchAppointments = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = doctorAppointments.filter(appt => appt.date === '2025-04-08');
      
      // Filter upcoming appointments
      const upcomingAppts = doctorAppointments.filter(appt => 
        appt.date === '2025-04-09'
      );
      
      setTodayAppointments(todayAppts);
      setUpcomingAppointments(upcomingAppts);
      setIsLoading(false);
    };
    
    fetchAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const EmptyAppointmentsMessage = () => (
    <div className="text-center py-8 text-gray-500">
      <Calendar className="h-10 w-10 mx-auto mb-4 text-gray-400" />
      <p>Aucun rendez-vous prévu</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={handleCreateAppointment}
      >
        Créer un rendez-vous
      </Button>
    </div>
  );

  // Handle viewing appointment details
  const handleViewAppointment = (id: string) => {
    navigate(`/doctor/appointments/${id}`);
    toast({
      title: "Afficher les détails",
      description: "Fonctionnalité en cours de développement",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bonjour, {user?.name}</h1>
            <p className="text-muted-foreground">
              Bienvenue dans votre tableau de bord. Voici un aperçu de votre activité.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90" onClick={handleCreateAppointment}>
              Nouveau rendez-vous
            </Button>
            {isPremium ? (
              <Button variant="outline" onClick={() => navigate('/doctor/analytics')}>
                Voir les analytiques
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/pricing')}>
                Mettre à niveau Premium
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Patients d'aujourd'hui" 
            value={todayAppointments.filter(a => a.status !== 'cancelled').length.toString()}
            description="Consultations planifiées" 
            icon={<Users className="h-4 w-4 text-white" />}
            color="bg-blue-500"
          />
          <DashboardCard 
            title="Cette semaine" 
            value="32" 
            description="Total des rendez-vous" 
            icon={<Calendar className="h-4 w-4 text-white" />}
            color="bg-green-500"
          />
          <DashboardCard 
            title="Taux de présence" 
            value="95%" 
            description="+2% par rapport au mois dernier" 
            icon={<TrendingUp className="h-4 w-4 text-white" />}
            color="bg-yellow-500"
          />
          <DashboardCard 
            title="Temps moyen" 
            value="23 min" 
            description="Durée moyenne de consultation" 
            icon={<Clock className="h-4 w-4 text-white" />}
            color="bg-purple-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Appointments Today */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Rendez-vous d'aujourd'hui</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
                </div>
              ) : todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center ${
                        appointment.status === 'cancelled' ? 'bg-red-50 border-red-200' : 'bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.type}</span>
                          {appointment.status === 'cancelled' && (
                            <>
                              <span>•</span>
                              <span className="text-red-500">Annulé</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant={appointment.status === 'cancelled' ? "outline" : "default"}
                        size="sm"
                        disabled={appointment.status === 'cancelled'}
                        onClick={() => handleViewAppointment(appointment.id)}
                        className="mt-2 md:mt-0"
                      >
                        Voir détails
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyAppointmentsMessage />
              )}

              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/doctor/appointments')}
                >
                  Voir tous les rendez-vous
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Activité hebdomadaire</CardTitle>
              <CardDescription>Rendez-vous par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStats}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value) => [`${value} rendez-vous`, 'Total']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar 
                      dataKey="appointments" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
            <CardDescription>Rendez-vous à venir</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="p-4 rounded-lg border bg-white"
                  >
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDate(appointment.date)} • {appointment.time}
                      </div>
                      <h4 className="font-medium">{appointment.patientName}</h4>
                      <div className="text-sm text-gray-500">{appointment.type}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Reporter
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewAppointment(appointment.id)}
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyAppointmentsMessage />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
