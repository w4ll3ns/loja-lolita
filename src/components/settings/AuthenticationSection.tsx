
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { SecuritySettings } from '@/types/store';

interface AuthenticationSectionProps {
  settings: SecuritySettings;
  onSettingChange: (key: keyof SecuritySettings, value: any) => void;
}

export const AuthenticationSection = ({ settings, onSettingChange }: AuthenticationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Autenticação
        </CardTitle>
        <CardDescription>
          Configure métodos de autenticação e segurança adicional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="twoFactorAuth">Autenticação em dois fatores</Label>
            <p className="text-sm text-muted-foreground">
              Exigir verificação adicional no login
            </p>
          </div>
          <Switch 
            id="twoFactorAuth"
            checked={settings.twoFactorAuth}
            onCheckedChange={(checked) => onSettingChange('twoFactorAuth', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Timeout de sessão (minutos)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => onSettingChange('sessionTimeout', parseInt(e.target.value) || 480)}
            min="15"
            max="1440"
            placeholder="480"
          />
          <p className="text-xs text-muted-foreground">
            Usuário será deslogado automaticamente após este tempo de inatividade
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
