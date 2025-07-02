
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { SecuritySettings } from '@/types/store';

interface SessionControlSectionProps {
  settings: SecuritySettings;
  onSettingChange: (key: keyof SecuritySettings, value: any) => void;
}

export const SessionControlSection = ({ settings, onSettingChange }: SessionControlSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Controle de Sessões
        </CardTitle>
        <CardDescription>
          Configure o acesso simultâneo de usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="multipleLogins">Permitir múltiplos acessos</Label>
            <p className="text-sm text-muted-foreground">
              Mesmo usuário pode estar logado em vários dispositivos
            </p>
          </div>
          <Switch 
            id="multipleLogins"
            checked={settings.multiple_logins}
            onCheckedChange={(checked) => onSettingChange('multiple_logins', checked)}
          />
        </div>

        {settings.multiple_logins && (
          <div className="space-y-2">
            <Label htmlFor="maxSessions">Máximo de sessões simultâneas</Label>
            <Select 
              value={settings.max_sessions.toString()} 
              onValueChange={(value) => onSettingChange('max_sessions', value === 'unlimited' ? 999 : parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="unlimited">Ilimitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
