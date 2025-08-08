import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Package } from 'lucide-react';
import { Product } from '@/types/store';

interface StockAlertSectionProps {
  selectedProducts: any[];
}

export const StockAlertSection: React.FC<StockAlertSectionProps> = ({ selectedProducts }) => {
  // Função para calcular estoque real
  const getRealStock = (product: Product) => {
    const baseStock = product.quantity || 0;
    const negativeStock = product.negative_stock || 0;
    return baseStock - negativeStock;
  };

  // Filtrar produtos com problemas de estoque
  const productsWithStockIssues = selectedProducts.filter(item => {
    const product = item.product;
    const realStock = getRealStock(product);
    const hasNegativeStock = (product.negative_stock || 0) > 0;
    const isLowStock = realStock <= 3 && realStock > 0;
    const isOutOfStock = realStock <= 0;
    
    return hasNegativeStock || isLowStock || isOutOfStock;
  });

  if (productsWithStockIssues.length === 0) {
    return null;
  }

  const getAlertIcon = (product: Product) => {
    const realStock = getRealStock(product);
    if (realStock < 0) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    return <Package className="h-4 w-4 text-yellow-600" />;
  };

  const getAlertTitle = (product: Product) => {
    const realStock = getRealStock(product);
    if (realStock < 0) {
      return 'Estoque Negativo';
    }
    return 'Estoque Baixo';
  };

  const getAlertDescription = (product: Product) => {
    const realStock = getRealStock(product);
    if (realStock < 0) {
      return `${product.name}: Estoque negativo (${realStock} unidades)`;
    }
    return `${product.name}: Apenas ${realStock} unidades disponíveis`;
  };

  const getAlertVariant = (product: Product) => {
    const realStock = getRealStock(product);
    if (realStock < 0) {
      return 'destructive';
    }
    return 'default';
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">⚠️ Alertas de Estoque</h4>
      {productsWithStockIssues.map((item, index) => {
        const product = item.product;
        return (
          <Alert key={index} variant={getAlertVariant(product)}>
            <div className="flex items-center gap-2">
              {getAlertIcon(product)}
              <div>
                <AlertTitle className="text-sm">{getAlertTitle(product)}</AlertTitle>
                <AlertDescription className="text-xs">
                  {getAlertDescription(product)}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}; 