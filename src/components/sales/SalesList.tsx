
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface SalesListProps {
  sales: any[];
}

export const SalesList = ({ sales }: SalesListProps) => {
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
                  {sale.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
