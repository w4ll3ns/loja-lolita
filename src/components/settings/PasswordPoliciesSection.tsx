
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';
import { SecuritySettings } from '@/types/store';

interface PasswordPoliciesSectionProps {
  settings: SecuritySettings;
  onSettingChange: (key: keyof SecuritySettings, value: any) => void;
}

export const PasswordPoliciesSection = ({ settings, onSettingChange }: PasswordPoliciesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Políticas de Senha
        </CardTitle>
        <CardDescription>
          Configure as regras para criação e uso de senhas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minPasswordLength">Mínimo de caracteres</Label>
            <Input
              id="minPasswordLength"
              type="number"
              value={settings.minPasswordLength}
              onChange={(e) => onSettingChange('minPasswordLength', parseInt(e.target.value) || 6)}
              min="6"
              max="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordExpiration">Expiração (dias)</Label>
            <Input
              id="passwordExpiration"
              type="number"
              value={settings.passwordExpiration}
              onChange={(e) => onSettingChange('passwordExpiration', parseInt(e.target.value) || 90)}
              min="30"
              max="365"
              placeholder="90"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireNumbers">Exigir números</Label>
              <p className="text-sm text-muted-foreground">
                Senha deve conter pelo menos um número
              </p>
            </div>
            <Switch 
              id="requireNumbers"
              checked={settings.requireNumbers}
              onCheckedChange={(checked) => onSettingChange('requireNumbers', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireSpecialChars">Exigir caracteres especiais</Label>
              <p className="text-sm text-muted-foreground">
                Senha deve conter símbolos (!@#$%...)
              </p>
            </div>
            <Switch 
              id="requireSpecialChars"
              checked={settings.requireSpecialChars}
              onCheckedChange={(checked) => onSettingChange('requireSpecialChars', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
