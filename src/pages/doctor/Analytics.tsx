
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { monthlyIncome, patientsByAge } from '../../lib/mock-data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const isPremium = user?.subscription === 'premium' || user?.subscription === 'enterprise';
  const navigate = useNavigate();

  useEffect(() => {
    // Restrict access for non-premium users
    if (!isPremium && !isLoading) {
      toast({
        variant: "destructive",
        title: "Accès réservé",
        description: "Cette fonctionnalité est réservée aux abonnements Premium et Entreprise.",
      });
      navigate('/pricing');
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPremium, navigate, isLoading]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-tbibdaba-teal animate-spin mb-4" />
          <p className="text-lg text-gray-600">Chargement de vos analytiques...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
          <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Fonctionnalité Premium</h1>
          <p className="text-gray-600 mb-6">
            Pour accéder aux analytiques avancées, veuillez mettre à niveau vers un abonnement Premium ou Entreprise.
          </p>
          <Button onClick={() => navigate('/pricing')}>
            Voir les abonnements
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Data for charts - would come from API in a real app
  const appointmentsByDay = [
    { name: 'Lun', completed: 8, cancelled: 1 },
    { name: 'Mar', completed: 10, cancelled: 2 },
    { name: 'Mer', completed: 7, cancelled: 0 },
    { name: 'Jeu', completed: 9, cancelled: 1 },
    { name: 'Ven', completed: 11, cancelled: 3 },
    { name: 'Sam', completed: 6, cancelled: 1 },
    { name: 'Dim', completed: 0, cancelled: 0 }
  ];

  const appointmentsByTime = [
    { hour: '08:00', count: 2 },
    { hour: '09:00', count: 5 },
    { hour: '10:00', count: 8 },
    { hour: '11:00', count: 6 },
    { hour: '12:00', count: 3 },
    { hour: '14:00', count: 7 },
    { hour: '15:00', count: 9 },
    { hour: '16:00', count: 7 },
    { hour: '17:00', count: 4 }
  ];

  const patientsDemographic = [
    { name: 'Hommes', value: 180 },
    { name: 'Femmes', value: 220 },
    { name: 'Enfants', value: 90 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytiques</h1>
          <p className="text-muted-foreground">
            Analysez vos performances et l'activité de votre cabinet médical.
          </p>
        </div>

        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              Télécharger le rapport
            </Button>
          </div>

          <TabsContent value="week" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rendez-vous cette semaine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">51</div>
                  <p className="text-xs text-muted-foreground">
                    +12% par rapport à la semaine précédente
                  </p>
                  <div className="h-[180px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={appointmentsByDay}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="Terminés" stackId="a" fill="#23A9B6" />
                        <Bar dataKey="cancelled" name="Annulés" stackId="a" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Heures de pointe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15:00</div>
                  <p className="text-xs text-muted-foreground">
                    Heure la plus demandée
                  </p>
                  <div className="h-[180px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={appointmentsByTime}>
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          name="Rendez-vous" 
                          stroke="#23A9B6" 
                          strokeWidth={2} 
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Démographie des patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[230px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientsDemographic}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {patientsDemographic.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} patients`, 'Total']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par âge</CardTitle>
                  <CardDescription>
                    Distribution des patients par tranche d'âge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={patientsByAge}>
                        <XAxis dataKey="age" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value) => [`${value} patients`, 'Total']} />
                        <Bar 
                          dataKey="count" 
                          name="Patients" 
                          fill="#9DC740" 
                          radius={[4, 4, 0, 0]} 
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  La tranche d'âge 31-45 ans représente votre plus grande patientèle.
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenus</CardTitle>
                  <CardDescription>
                    Evolution mensuelle des revenus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyIncome}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value) => [`${value} MAD`, 'Revenus']} />
                        <Line 
                          type="monotone" 
                          dataKey="income" 
                          name="Revenus" 
                          stroke="#23A9B6" 
                          strokeWidth={2} 
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  Tendance à la hausse avec +15% par rapport à l'année précédente.
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="month" className="text-center py-12">
            <p className="text-muted-foreground">
              Pour voir les analytiques mensuelles détaillées, utilisez les filtres ci-dessus ou téléchargez le rapport complet.
            </p>
          </TabsContent>

          <TabsContent value="year" className="text-center py-12">
            <p className="text-muted-foreground">
              Pour voir les analytiques annuelles détaillées, utilisez les filtres ci-dessus ou téléchargez le rapport complet.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
