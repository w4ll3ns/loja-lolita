import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Product } from '@/types/store';

interface NegativeStockAlertProps {
  negativeStockProducts: Product[];
  negativeStockCount: number;
  negativeStockValue: number;
}

export const NegativeStockAlert: React.FC<NegativeStockAlertProps> = ({
  negativeStockProducts,
  negativeStockCount,
  negativeStockValue
}) => {
  if (negativeStockCount === 0) {
    return null;
  }

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="font-medium">
              {negativeStockCount} produto{negativeStockCount > 1 ? 's' : ''} com estoque negativo
            </span>
          </div>
          <div className="text-sm">
            Total: {negativeStockValue} unidade{negativeStockValue > 1 ? 's' : ''} em débito
          </div>
        </div>
        {negativeStockProducts.length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Produtos afetados:</span>
            <div className="mt-1 space-y-1">
              {negativeStockProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">{product.name}</span>
                  <span className="font-medium text-red-700">
                    {product.quantity} unidade{Math.abs(product.quantity) > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
              {negativeStockProducts.length > 3 && (
                <div className="text-xs text-red-600">
                  +{negativeStockProducts.length - 3} mais produto{negativeStockProducts.length - 3 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

