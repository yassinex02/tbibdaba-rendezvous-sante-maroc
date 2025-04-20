
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Bell, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Reminder {
  id: string;
  appointmentId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reminderTime: Date;
  read: boolean;
}

interface RemindersTabProps {
  reminders: Reminder[];
  onMarkAsRead: (id: string) => void;
}

const RemindersTab = ({ reminders, onMarkAsRead }: RemindersTabProps) => {
  const formatReminderTime = (date: Date) => {
    return format(date, 'PPPp', { locale: fr });
  };
  
  const formatAppointmentTime = (date: string, time: string) => {
    const appointmentDate = new Date(date);
    return format(appointmentDate, 'PPP', { locale: fr }) + ' à ' + time;
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mes rappels</h2>
      
      {reminders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">Aucun rappel</h3>
            <p className="text-gray-500 text-center">
              Vous n'avez pas de rappels à venir pour vos rendez-vous
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {reminders.length} {reminders.length === 1 ? 'rappel' : 'rappels'} pour vos prochains rendez-vous
          </p>
          
          {reminders.map((reminder) => (
            <Card key={reminder.id} className={`mb-4 ${!reminder.read ? 'border-l-4 border-l-tbibdaba-teal' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Bell className={`h-5 w-5 ${!reminder.read ? 'text-tbibdaba-teal' : 'text-gray-400'} mr-2`} />
                      <h3 className="text-lg font-medium">
                        Rendez-vous avec {reminder.doctorName}
                      </h3>
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {formatAppointmentTime(reminder.appointmentDate, reminder.appointmentTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          Rappel programmé pour: {formatReminderTime(reminder.reminderTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!reminder.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => onMarkAsRead(reminder.id)}
                      aria-label="Marquer comme lu"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RemindersTab;
