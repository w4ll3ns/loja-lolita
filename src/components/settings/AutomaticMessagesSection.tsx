
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageSquare } from 'lucide-react';
import { NotificationSettings } from '@/types/store';

interface AutomaticMessagesSectionProps {
  settings: NotificationSettings;
  onSettingChange: (key: keyof NotificationSettings, value: any) => void;
}

export const AutomaticMessagesSection = ({ settings, onSettingChange }: AutomaticMessagesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Mensagens Automáticas
        </CardTitle>
        <CardDescription>
          Configure mensagens automáticas para clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="thankYouMessage">Mensagem de agradecimento pós-venda</Label>
            <p className="text-sm text-muted-foreground">
              Enviar mensagem automática após cada venda realizada
            </p>
          </div>
          <Switch 
            id="thankYouMessage"
            checked={settings.thankYouMessage}
            onCheckedChange={(checked) => onSettingChange('thankYouMessage', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="birthdayMessage">Mensagem de aniversário</Label>
            <p className="text-sm text-muted-foreground">
              Enviar parabéns automático no aniversário dos clientes
            </p>
          </div>
          <Switch 
            id="birthdayMessage"
            checked={settings.birthdayMessage}
            onCheckedChange={(checked) => onSettingChange('birthdayMessage', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
