
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SalesListProps {
  sales: any[];
}

export const SalesList = ({ sales }: SalesListProps) => {
  const [salesWithReturns, setSalesWithReturns] = useState<Map<string, { status: string; refundAmount: number; items: any[] }>>(new Map());

  // Verificar quais vendas têm devoluções
  useEffect(() => {
    const checkReturnsForSales = async () => {
      if (sales.length === 0) return;

      const saleIds = sales.map(sale => sale.id);
      
      try {
        const { data: returns, error } = await supabase
          .from('returns')
          .select(`
            sale_id, 
            status, 
            refund_amount,
            return_items(
              quantity,
              refund_price,
              product:products(name)
            )
          `)
          .in('sale_id', saleIds);

        if (error) {
          console.error('Error checking returns:', error);
          return;
        }

        // Criar um Map com informações detalhadas das devoluções
        const salesWithReturnsMap = new Map();
        returns.forEach((r: any) => {
          salesWithReturnsMap.set(r.sale_id, {
            status: r.status,
            refundAmount: r.refund_amount || 0,
            items: r.return_items || []
          });
        });
        setSalesWithReturns(salesWithReturnsMap);
      } catch (error) {
        console.error('Error checking returns:', error);
      }
    };

    checkReturnsForSales();
  }, [sales]);

  if (sales.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhuma venda realizada</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sales.map((sale) => (
        <Card key={sale.id} className="card-hover">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {sale.customer.name}
                  {sale.customer.isGeneric && (
                    <Badge variant="secondary" className="text-xs">Cliente Padrão</Badge>
                  )}
                  {salesWithReturns.has(sale.id) && (
                    <Badge 
                      variant={salesWithReturns.get(sale.id)?.status === 'completed' ? 'destructive' : 'secondary'} 
                      className="text-xs flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {salesWithReturns.get(sale.id)?.status === 'completed' ? 'Devolvida' : 'Devolvida Parcialmente'}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {sale.date.toLocaleDateString()} - {sale.date.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-store-green-600">
                  R$ {sale.total.toFixed(2)}
                </p>
                <Badge variant="outline" className="capitalize">
                  {sale.paymentMethod === 'pix' ? 'PIX' : 
                   sale.paymentMethod === 'debito' ? 'Débito' : 'Crédito'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Vendedor:</span> {sale.seller}
                </div>
                <div>
                  <span className="text-muted-foreground">Caixa:</span> {sale.cashier}
                </div>
              </div>
              {sale.discount > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Subtotal:</span> R$ {sale.subtotal.toFixed(2)} | 
                  <span className="text-red-600 ml-1">Desconto: R$ {sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Itens:</p>
                <div className="space-y-1">
                  {sale.items.map((item, index) => {
                    // Verificar se este item foi devolvido
                    const returnInfo = salesWithReturns.get(sale.id);
                    const returnedItem = returnInfo?.items?.find((ri: any) => ri.product?.name === item.product.name);
                    
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span>{item.quantity}x {item.product.name}</span>
                          {returnedItem && (
                            <p className="text-xs text-orange-600 font-medium">
                              ⚠️ {returnedItem.quantity} unidade(s) devolvida(s) - R$ {(returnedItem.quantity * returnedItem.refund_price).toFixed(2)}
                            </p>
                          )}
                          {item.product.barcode && (
                            <p className="text-xs text-muted-foreground font-mono">
                              Código: {item.product.barcode}
                            </p>
                          )}
                        </div>
                        <span className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Informações de devolução */}
                {salesWithReturns.has(sale.id) && (
                  <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-xs font-medium text-orange-800 mb-1">
                      📋 Informações da Devolução:
                    </p>
                    <p className="text-xs text-orange-700">
                      Valor devolvido: R$ {salesWithReturns.get(sale.id)?.refundAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-orange-700">
                      Status: {salesWithReturns.get(sale.id)?.status === 'completed' ? 'Completa' : 'Parcial'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
