
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, MessageSquare, Gift, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    lowStockAlert: true,
    lowStockQuantity: '5',
    thankYouMessage: false,
    birthdayMessage: false,
    whatsappNotifications: true,
    emailNotifications: false,
    alertFrequency: 'daily',
    alertTime: '09:00'
  });

  const handleSave = () => {
    console.log('Salvando configurações de notificações:', settings);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Notificações</h1>
          <p className="text-muted-foreground">
            Configure alertas e automações do sistema
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>
              Configure quando ser notificado sobre produtos com estoque baixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lowStockAlert">Alerta de estoque baixo</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando produtos estiverem com estoque baixo
                </p>
              </div>
              <Switch 
                id="lowStockAlert"
                checked={settings.lowStockAlert}
                onCheckedChange={(checked) => updateSetting('lowStockAlert', checked)}
              />
            </div>

            {settings.lowStockAlert && (
              <div className="space-y-2">
                <Label htmlFor="lowStockQuantity">Quantidade mínima para alerta</Label>
                <Input
                  id="lowStockQuantity"
                  type="number"
                  value={settings.lowStockQuantity}
                  onChange={(e) => updateSetting('lowStockQuantity', e.target.value)}
                  placeholder="5"
                  className="w-24"
                />
                <p className="text-xs text-muted-foreground">
                  Alerta quando o estoque for igual ou menor que este valor
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
                onCheckedChange={(checked) => updateSetting('thankYouMessage', checked)}
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
                onCheckedChange={(checked) => updateSetting('birthdayMessage', checked)}
              />
            </div>
          </CardContent>
        </Card>

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
                onCheckedChange={(checked) => updateSetting('whatsappNotifications', checked)}
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
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

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
              <Select value={settings.alertFrequency} onValueChange={(value) => updateSetting('alertFrequency', value)}>
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

            {settings.alertFrequency !== 'realtime' && (
              <div className="space-y-2">
                <Label htmlFor="alertTime">Horário dos alertas</Label>
                <Input
                  id="alertTime"
                  type="time"
                  value={settings.alertTime}
                  onChange={(e) => updateSetting('alertTime', e.target.value)}
                  className="w-32"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettingsPage;
