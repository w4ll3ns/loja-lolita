
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Pencil, Copy } from 'lucide-react';
import type { Product } from '@/contexts/StoreContext';

interface ProductCardProps {
  product: Product;
  canEdit: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  canEdit,
  onEdit,
  onDuplicate
}) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <div className="flex gap-1">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(product)}
                className="text-gray-500 hover:text-blue-600 p-1"
                title="Editar produto"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(product)}
                className="text-gray-500 hover:text-green-600 p-1"
                title="Duplicar produto"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{product.category} - {product.size}</p>
          <p>{product.brand} - {product.color}</p>
          <p className="font-medium text-blue-600">{product.gender}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Preço Venda:</span>
            <span className="font-semibold text-store-green-600">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Preço Custo:</span>
            <span className="font-semibold text-gray-600">
              R$ {product.costPrice.toFixed(2)}
            </span>
          </div>
          <ProfitMarginDisplay 
            salePrice={product.price} 
            costPrice={product.costPrice}
            className="border-t pt-2"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estoque:</span>
            <span className={`font-semibold ${
              product.quantity <= 5 ? 'text-red-600' : 'text-green-600'
            }`}>
              {product.quantity} unidades
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Código:</span>
            <span className="text-xs font-mono">{product.barcode}</span>
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
