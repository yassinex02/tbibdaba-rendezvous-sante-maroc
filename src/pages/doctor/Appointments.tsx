
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Filter, MoreHorizontal, CheckCircle, AlertCircle, Clock, X, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { doctorAppointments } from '../../lib/mock-data';
import { toast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
  type: string;
  notes?: string;
}

const AppointmentCard = ({ appointment, onStatusChange }: { 
  appointment: Appointment,
  onStatusChange: (id: string, status: string) => void
}) => {
  const statusColors = {
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-800', icon: <Clock className="h-4 w-4 text-blue-600" /> },
    completed: { bg: 'bg-green-50', text: 'text-green-800', icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
    cancelled: { bg: 'bg-red-50', text: 'text-red-800', icon: <X className="h-4 w-4 text-red-600" /> },
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: <AlertCircle className="h-4 w-4 text-yellow-600" /> },
  };

  const statusLabels = {
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
    pending: 'En attente',
  };

  const status = appointment.status as keyof typeof statusColors;
  const { bg, text, icon } = statusColors[status];
  const statusLabel = statusLabels[status];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                {appointment.patientName.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{appointment.patientName}</h3>
                <p className="text-sm text-gray-500">{appointment.type}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end mt-4 md:mt-0 space-y-2">
            <Badge variant="outline" className={`flex items-center ${bg} ${text} border-0 gap-1`}>
              {icon}
              {statusLabel}
            </Badge>

            <div className="flex gap-2 mt-2">
              {status !== 'completed' && status !== 'cancelled' && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onStatusChange(appointment.id, 'completed')}>
                  Terminer
                </Button>
              )}
              {status !== 'cancelled' && status !== 'completed' && (
                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => onStatusChange(appointment.id, 'cancelled')}>
                  Annuler
                </Button>
              )}
              {status === 'cancelled' && (
                <Button size="sm" variant="outline" onClick={() => onStatusChange(appointment.id, 'confirmed')}>
                  Rétablir
                </Button>
              )}
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="mt-3 text-sm text-gray-600 border-t pt-2">
            <span className="font-medium">Notes:</span> {appointment.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleCreateAppointment = () => {
    toast({
      title: "Nouveau rendez-vous",
      description: "Fonctionnalité en cours de développement",
    });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppointments(doctorAppointments);
      setFilteredAppointments(doctorAppointments);
      setIsLoading(false);
    };
    
    fetchAppointments();
  }, []);

  useEffect(() => {
    let result = [...appointments];
    
    if (filter !== 'all') {
      result = result.filter(appointment => appointment.status === filter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(appointment => 
        appointment.patientName.toLowerCase().includes(term) ||
        appointment.type.toLowerCase().includes(term)
      );
    }
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      result = result.filter(appointment => appointment.date === dateString);
    }
    
    setFilteredAppointments(result);
  }, [filter, searchTerm, selectedDate, appointments]);

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    );
    
    setAppointments(updatedAppointments);
    
    const appointment = appointments.find(a => a.id === id);
    const statusMessages = {
      completed: `Rendez-vous avec ${appointment?.patientName} marqué comme terminé`,
      cancelled: `Rendez-vous avec ${appointment?.patientName} annulé`,
      confirmed: `Rendez-vous avec ${appointment?.patientName} rétabli`,
    };
    
    toast({
      title: statusMessages[newStatus as keyof typeof statusMessages],
      variant: newStatus === 'cancelled' ? 'destructive' : 'default',
    });
  };

  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setSelectedDate(undefined);
  };

  const formatDateForDisplay = (date?: Date) => {
    if (!date) return 'Sélectionner une date';
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rendez-vous</h1>
            <p className="text-muted-foreground">
              Gérez vos rendez-vous et votre planning
            </p>
          </div>
          <Button onClick={handleCreateAppointment} className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rendez-vous
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
                <CardDescription>
                  Affinez la liste des rendez-vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="grid w-full items-center gap-1.5">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Statut" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="confirmed">Confirmés</SelectItem>
                        <SelectItem value="completed">Terminés</SelectItem>
                        <SelectItem value="cancelled">Annulés</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input 
                        type="search" 
                        placeholder="Rechercher un patient..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDateForDisplay(selectedDate)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setCalendarOpen(false);
                          }}
                          className="rounded-md border"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Button variant="ghost" onClick={() => {
                      clearFilters();
                      setCalendarOpen(false);
                    }}>
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div>
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Aucun rendez-vous trouvé</h3>
                  <p className="text-gray-500 text-center">
                    Aucun rendez-vous ne correspond à vos critères. Essayez d'ajuster les filtres.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Vue Calendrier</CardTitle>
                <CardDescription>
                  Cette vue sera disponible prochainement
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={setSelectedDate}
                  className="rounded-md border" 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
