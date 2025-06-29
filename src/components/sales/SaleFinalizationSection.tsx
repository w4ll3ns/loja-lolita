
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, DollarSign, ShoppingCart } from 'lucide-react';

interface SaleFinalizationSectionProps {
  hasProducts: boolean;
  discount: { value: number; type: 'percentage' | 'value' };
  paymentMethod: 'pix' | 'debito' | 'credito';
  subtotal: number;
  discountAmount: number;
  total: number;
  onDiscountChange: (discount: { value: number; type: 'percentage' | 'value' }) => void;
  onPaymentMethodChange: (method: 'pix' | 'debito' | 'credito') => void;
  onFinalizeSale: () => void;
  disabled?: boolean;
}

export const SaleFinalizationSection = ({
  hasProducts,
  discount,
  paymentMethod,
  subtotal,
  discountAmount,
  total,
  onDiscountChange,
  onPaymentMethodChange,
  onFinalizeSale,
  disabled = false
}: SaleFinalizationSectionProps) => {
  return (
    <div className={`${hasProducts ? 'relative mt-6' : 'fixed bottom-0 left-0 right-0'} bg-white border-t border-gray-200 p-3 shadow-lg z-40`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          {/* Campo de Desconto */}
          <div className="space-y-1">
            <Label className={`text-sm ${hasProducts ? 'text-gray-900' : 'text-gray-400'}`}>
              Desconto
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0"
                value={discount.value || ''}
                onChange={(e) => onDiscountChange({ ...discount, value: Number(e.target.value) || 0 })}
                className="flex-1 h-9"
                disabled={!hasProducts || disabled}
              />
              <Select 
                value={discount.type} 
                onValueChange={(value: 'percentage' | 'value') => onDiscountChange({ ...discount, type: value })}
                disabled={!hasProducts || disabled}
              >
                <SelectTrigger className="w-14 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="percentage">
                    <Percent className="h-3 w-3" />
                  </SelectItem>
                  <SelectItem value="value">
                    <DollarSign className="h-3 w-3" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="space-y-1">
            <Label className={`text-sm ${hasProducts ? 'text-gray-900' : 'text-gray-400'}`}>
              Pagamento
            </Label>
            <Select 
              value={paymentMethod} 
              onValueChange={(value: 'pix' | 'debito' | 'credito') => onPaymentMethodChange(value)}
              disabled={!hasProducts || disabled}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="debito">Cartão de Débito</SelectItem>
                <SelectItem value="credito">Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Totais */}
          <div className="space-y-0">
            <div className="text-right">
              <p className="text-xs text-gray-600">
                Subtotal: R$ {subtotal.toFixed(2)}
              </p>
              {discountAmount > 0 && (
                <p className="text-xs text-red-600">
                  Desconto: -R$ {discountAmount.toFixed(2)}
                </p>
              )}
              <p className="text-sm font-bold text-store-green-600">
                Total: R$ {total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Botão Finalizar */}
          <div>
            <Button 
              onClick={onFinalizeSale}
              className="w-full bg-store-green-600 hover:bg-store-green-700 h-9 text-sm font-semibold"
              disabled={!hasProducts || disabled}
            >
              <ShoppingCart className="h-3 w-3 mr-2" />
              Finalizar
              {hasProducts && (
                <span className="ml-2">
                  R$ {total.toFixed(2)}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {!hasProducts && (
          <p className="text-center text-gray-500 text-xs mt-1">
            Adicione pelo menos um produto para habilitar a finalização
          </p>
        )}
      </div>
    </div>
  );
};
