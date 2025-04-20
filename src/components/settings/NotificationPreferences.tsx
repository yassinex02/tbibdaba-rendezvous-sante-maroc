
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface NotificationSettings {
  emailAppointmentReminders: boolean;
  emailChatMessages: boolean;
  smsAppointmentReminders: boolean;
  smsChatMessages: boolean;
  pushNotifications: boolean;
}

const defaultSettings: NotificationSettings = {
  emailAppointmentReminders: true,
  emailChatMessages: true,
  smsAppointmentReminders: true,
  smsChatMessages: false,
  pushNotifications: true,
};

const NotificationPreferences = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<NotificationSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationPreferences');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setInitialSettings(parsedSettings);
    }
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('notificationPreferences', JSON.stringify(settings));
      setInitialSettings(settings);
      
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de notification ont été mises à jour",
      });
      
      setIsSaving(false);
    }, 500);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>
          Gérez comment et quand vous recevez des notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium">Notifications par email</h3>
          </div>
          
          <div className="grid gap-3 pl-7">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-appointments" className="text-sm">
                Rappels de rendez-vous
              </Label>
              <Switch
                id="email-appointments"
                checked={settings.emailAppointmentReminders}
                onCheckedChange={() => handleToggle('emailAppointmentReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-messages" className="text-sm">
                Nouveaux messages
              </Label>
              <Switch
                id="email-messages"
                checked={settings.emailChatMessages}
                onCheckedChange={() => handleToggle('emailChatMessages')}
              />
            </div>
          </div>
        </div>
        
        {/* SMS Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium">Notifications SMS</h3>
          </div>
          
          <div className="grid gap-3 pl-7">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-appointments" className="text-sm">
                Rappels de rendez-vous
              </Label>
              <Switch
                id="sms-appointments"
                checked={settings.smsAppointmentReminders}
                onCheckedChange={() => handleToggle('smsAppointmentReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-messages" className="text-sm">
                Nouveaux messages
              </Label>
              <Switch
                id="sms-messages"
                checked={settings.smsChatMessages}
                onCheckedChange={() => handleToggle('smsChatMessages')}
              />
            </div>
          </div>
        </div>
        
        {/* Push Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium">Notifications push</h3>
          </div>
          
          <div className="grid gap-3 pl-7">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-all" className="text-sm">
                Toutes les notifications
              </Label>
              <Switch
                id="push-all"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
