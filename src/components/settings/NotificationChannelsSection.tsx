
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { NotificationSettings } from '@/types/store';

interface NotificationChannelsSectionProps {
  settings: NotificationSettings;
  onSettingChange: (key: keyof NotificationSettings, value: any) => void;
}

export const NotificationChannelsSection = ({ settings, onSettingChange }: NotificationChannelsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Canais de Notificação
        </CardTitle>
        <CardDescription>
          Escolha como deseja receber as notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="whatsappNotifications">WhatsApp</Label>
            <p className="text-sm text-muted-foreground">
              Receber notificações via WhatsApp
            </p>
          </div>
          <Switch 
            id="whatsappNotifications"
            checked={settings.whatsappNotifications}
            onCheckedChange={(checked) => onSettingChange('whatsappNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">E-mail</Label>
            <p className="text-sm text-muted-foreground">
              Receber notificações por e-mail
            </p>
          </div>
          <Switch 
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
