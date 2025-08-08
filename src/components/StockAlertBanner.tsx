import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StockAlert {
  productName: string;
  currentStock: number;
  alertType: 'low_stock' | 'negative_stock' | 'out_of_stock';
}

interface StockAlertBannerProps {
  alerts: StockAlert[];
  onDismiss?: (productName: string) => void;
}

export const StockAlertBanner: React.FC<StockAlertBannerProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'negative_stock':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'low_stock':
        return <Package className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getAlertTitle = (type: string) => {
    switch (type) {
      case 'negative_stock':
        return 'Estoque Negativo';
      case 'low_stock':
        return 'Estoque Baixo';
      default:
        return 'Alerta de Estoque';
    }
  };

  const getAlertDescription = (alert: StockAlert) => {
    switch (alert.alertType) {
      case 'negative_stock':
        return `${alert.productName}: Estoque negativo (${alert.currentStock} unidades)`;
      case 'low_stock':
        return `${alert.productName}: Apenas ${alert.currentStock} unidades disponíveis`;
      default:
        return `${alert.productName}: Estoque crítico`;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'negative_stock':
        return 'destructive';
      case 'low_stock':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <Alert key={index} variant={getAlertVariant(alert.alertType)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getAlertIcon(alert.alertType)}
              <div>
                <AlertTitle>{getAlertTitle(alert.alertType)}</AlertTitle>
                <AlertDescription>
                  {getAlertDescription(alert)}
                </AlertDescription>
              </div>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.productName)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
}; 