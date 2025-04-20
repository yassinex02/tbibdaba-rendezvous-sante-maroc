
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { doctorAppointments } from '@/lib/mock-data';

interface AppointmentMetrics {
  totalUpcoming: number;
  totalPatients: number;
  totalRevenue: number;
  completionRate: string;
}

const calculateMetrics = (appointments: any[]): AppointmentMetrics => {
  // Get unique patients
  const uniquePatients = new Set(appointments.map(app => app.patientId)).size;
  
  // Count upcoming appointments (assuming future dates)
  const today = new Date();
  const upcoming = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate >= today && app.status !== 'cancelled';
  }).length;
  
  // Calculate revenue (assume 300-500 MAD per appointment)
  const revenue = appointments.reduce((total, app) => {
    if (app.status === 'completed') {
      // Random amount between 300-500 MAD
      const rate = app.rate || (300 + Math.floor(Math.random() * 200));
      return total + rate;
    }
    return total;
  }, 0);
  
  // Calculate completion rate
  const completed = appointments.filter(app => app.status === 'completed').length;
  const total = appointments.length;
  const completionRate = total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';
  
  return {
    totalUpcoming: upcoming,
    totalPatients: uniquePatients,
    totalRevenue: revenue,
    completionRate
  };
};

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

// Monthly data for revenues chart
const generateMonthlyData = (appointments: any[]) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  // Create a map to hold monthly revenues
  const monthlyRevenue = months.map(month => ({
    name: month,
    revenue: 0
  }));
  
  // Aggregate appointments by month
  appointments.forEach(app => {
    if (app.status === 'completed') {
      const date = new Date(app.date);
      const month = date.getMonth();
      const rate = app.rate || (300 + Math.floor(Math.random() * 200));
      monthlyRevenue[month].revenue += rate;
    }
  });
  
  return monthlyRevenue;
};

const DoctorMetrics = () => {
  const [metrics, setMetrics] = useState<AppointmentMetrics>({
    totalUpcoming: 0,
    totalPatients: 0,
    totalRevenue: 0,
    completionRate: '0%'
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate metrics
    const calculatedMetrics = calculateMetrics(doctorAppointments);
    setMetrics(calculatedMetrics);
    
    // Generate monthly revenue data
    const monthlyData = generateMonthlyData(doctorAppointments);
    setRevenueData(monthlyData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Rendez-vous à venir" 
          value={metrics.totalUpcoming.toString()}
          description="Consultations planifiées" 
          icon={<Calendar className="h-4 w-4 text-white" />}
          color="bg-blue-500"
        />
        <DashboardCard 
          title="Total patients" 
          value={metrics.totalPatients.toString()} 
          description="Patients uniques" 
          icon={<Users className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />
        <DashboardCard 
          title="Revenu total" 
          value={`${metrics.totalRevenue} MAD`} 
          description="Base: 300-500 MAD/consultation" 
          icon={<DollarSign className="h-4 w-4 text-white" />}
          color="bg-yellow-500"
        />
        <DashboardCard 
          title="Taux de réalisation" 
          value={metrics.completionRate} 
          description="Rendez-vous complétés" 
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          color="bg-purple-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenus mensuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value} MAD`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} MAD`, 'Revenu']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorMetrics;
