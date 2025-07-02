
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationSettings } from '@/types/store';

interface FrequencyTimingSectionProps {
  settings: NotificationSettings;
  onSettingChange: (key: keyof NotificationSettings, value: any) => void;
}

export const FrequencyTimingSection = ({ settings, onSettingChange }: FrequencyTimingSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequência e Horário</CardTitle>
        <CardDescription>
          Configure quando receber os alertas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="alertFrequency">Frequência dos alertas</Label>
            <Select 
              value={settings.alert_frequency} 
              onValueChange={(value: 'realtime' | 'daily' | 'weekly') => onSettingChange('alert_frequency', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Tempo real</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {settings.alert_frequency !== 'realtime' && (
          <div className="space-y-2">
            <Label htmlFor="alertTime">Horário dos alertas</Label>
            <Input
              id="alertTime"
              type="time"
              value={settings.alert_time}
              onChange={(e) => onSettingChange('alert_time', e.target.value)}
              className="w-32"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
