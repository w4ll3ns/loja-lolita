
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle } from 'lucide-react';
import { NotificationSettings } from '@/types/store';

interface StockAlertsSectionProps {
  settings: NotificationSettings;
  onSettingChange: (key: keyof NotificationSettings, value: any) => void;
}

export const StockAlertsSection = ({ settings, onSettingChange }: StockAlertsSectionProps) => {
  return (
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
            checked={settings.low_stock_alert}
            onCheckedChange={(checked) => onSettingChange('low_stock_alert', checked)}
          />
        </div>

        {settings.low_stock_alert && (
          <div className="space-y-2">
            <Label htmlFor="lowStockQuantity">Quantidade mínima para alerta</Label>
            <Input
              id="lowStockQuantity"
              type="number"
              min="0"
              value={settings.low_stock_quantity}
              onChange={(e) => onSettingChange('low_stock_quantity', parseInt(e.target.value) || 0)}
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
  );
};
