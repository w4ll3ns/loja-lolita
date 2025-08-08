
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Pencil, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/store';

interface ProductTableRowProps {
  product: Product;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  isSelected: boolean;
  onSelect: (productId: string, selected: boolean) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  canEdit,
  canDelete,
  onEdit,
  onDuplicate,
  onDelete,
  isSelected,
  onSelect
}) => {
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
      return `${stock} (negativo)`;
    }
    return `${stock}`;
  };

  return (
    <TableRow>
      {canEdit && (
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(product.id, !!checked)}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{product.brand}</TableCell>
      <TableCell>{product.color}</TableCell>
      <TableCell>{product.size}</TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.gender}
        </span>
      </TableCell>
      <TableCell className="font-semibold text-store-green-600">
        R$ {product.price.toFixed(2)}
      </TableCell>
      <TableCell className="font-semibold text-gray-600">
        R$ {product.costPrice.toFixed(2)}
      </TableCell>
      <TableCell>
        <ProfitMarginDisplay 
          salePrice={product.price} 
          costPrice={product.costPrice}
          className="text-xs"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {(hasNegativeStock || isOutOfStock) && (
            <AlertTriangle className="h-3 w-3 text-red-600" />
          )}
          <span className={`font-semibold ${getStockColor()}`}>
            {getStockText()}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs">{product.barcode}</TableCell>
      {canEdit && (
        <TableCell>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="text-gray-500 hover:text-blue-600"
              title="Editar produto"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(product)}
              className="text-gray-500 hover:text-green-600"
              title="Duplicar produto"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(product)}
                className="text-gray-500 hover:text-red-600"
                title="Excluir produto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};
