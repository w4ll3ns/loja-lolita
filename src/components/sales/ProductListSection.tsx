
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SaleItem } from '@/contexts/StoreContext';
import { cn } from '@/lib/utils';

interface ProductListSectionProps {
  selectedProducts: SaleItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdatePrice: (productId: string, price: number) => void;
  onRemoveProduct: (productId: string) => void;
}

export const ProductListSection = ({
  selectedProducts,
  onUpdateQuantity,
  onUpdatePrice,
  onRemoveProduct
}: ProductListSectionProps) => {
  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium">Produtos Adicionados</h4>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {selectedProducts.map((item) => (
          <div 
            key={item.product.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded border",
              item.product.category === 'Temporário' 
                ? "bg-orange-50 border-orange-200" 
                : "bg-muted"
            )}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{item.product.name}</p>
                {item.product.category === 'Temporário' && (
                  <Badge variant="destructive" className="text-xs">
                    Não cadastrado
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {item.product.barcode}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {item.product.category === 'Temporário' && (
                <div className="flex flex-col gap-1">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Preço"
                    value={item.price || ''}
                    onChange={(e) => onUpdatePrice(item.product.id, parseFloat(e.target.value) || 0)}
                    className="w-20 text-xs"
                  />
                </div>
              )}
              {item.product.category !== 'Temporário' && (
                <p className="text-xs text-muted-foreground">
                  R$ {item.price.toFixed(2)} cada
                </p>
              )}
              <Input
                type="number"
                min="1"
                max={item.product.category === 'Temporário' ? 999 : item.product.quantity}
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.product.id, parseInt(e.target.value))}
                className="w-14 text-xs"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveProduct(item.product.id)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
