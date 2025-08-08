
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Pencil, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/store';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  canEdit: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  isSelected?: boolean;
  onSelect?: (productId: string, selected: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  canEdit,
  onEdit,
  onDuplicate,
  onDelete,
  isSelected = false,
  onSelect
}) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'admin';

  // Calcular estoque
  const stock = product.quantity || 0;
  const hasNegativeStock = stock < 0;
  const isLowStock = stock <= 3 && stock > 0;
  const isOutOfStock = stock <= 0;

  // Função para obter a cor do estoque
  const getStockColor = () => {
    if (hasNegativeStock) return 'text-red-600';
    if (isOutOfStock) return 'text-red-600';
    if (isLowStock) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Função para obter o texto do estoque
  const getStockText = () => {
    if (hasNegativeStock) {
      return `${stock} unidades (negativo)`;
    }
    if (isOutOfStock) {
      return `${stock} unidades`;
    }
    return `${stock} unidades`;
  };

  // Função para obter o ícone do estoque
  const getStockIcon = () => {
    if (hasNegativeStock || isOutOfStock) {
      return <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />;
    }
    return null;
  };

  return (
    <Card className="card-hover relative h-full flex flex-col">
      {canEdit && onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(product.id, !!checked)}
          />
        </div>
      )}
      
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base md:text-lg pr-2 leading-tight">{product.name}</CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            {canEdit && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="text-gray-500 hover:text-blue-600 p-1 h-8 w-8"
                  title="Editar produto"
                >
                  <Pencil className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDuplicate(product)}
                  className="text-gray-500 hover:text-green-600 p-1 h-8 w-8"
                  title="Duplicar produto"
                >
                  <Copy className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product)}
                    className="text-gray-500 hover:text-red-600 p-1 h-8 w-8"
                    title="Excluir produto"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground space-y-1">
          <p>{product.category} - {product.size}</p>
          <p>{product.brand} - {product.color}</p>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.gender}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Preço Venda:</span>
            <span className="font-semibold text-store-green-600 text-sm md:text-base">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Preço Custo:</span>
            <span className="font-semibold text-gray-600 text-sm md:text-base">
              R$ {product.costPrice.toFixed(2)}
            </span>
          </div>
          <ProfitMarginDisplay 
            salePrice={product.price} 
            costPrice={product.costPrice}
            className="border-t pt-2 text-xs"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Estoque:</span>
            <div className="flex items-center gap-1">
              {getStockIcon()}
              <span className={`font-semibold text-sm md:text-base ${getStockColor()}`}>
                {getStockText()}
              </span>
            </div>
          </div>
          {hasNegativeStock && (
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-muted-foreground">Estoque Físico:</span>
              <span className="text-xs font-semibold text-gray-600">
                {product.quantity} unidades
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-muted-foreground">Código:</span>
            <span className="text-xs font-mono break-all">{product.barcode}</span>
          </div>
          {product.description && (
            <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
