import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, Calendar, DollarSign, MessageSquare, Send, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSales } from '@/contexts/SalesContext';
import { useToast } from '@/hooks/use-toast';
import { SalesList } from '@/components/sales/SalesList';
import { supabase } from '@/integrations/supabase/client';

const MySalesPage = () => {
  const { user } = useAuth();
  const { sales } = useSales();
  const { toast } = useToast();
  const [selectedSale, setSelectedSale] = useState(null);
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [salesWithReturns, setSalesWithReturns] = useState(new Map());

  // Filtrar vendas do vendedor logado
  const mySales = sales.filter(sale => sale.seller === user?.name);

  // Verificar quais vendas têm devoluções
  useEffect(() => {
    const checkReturnsForSales = async () => {
      if (mySales.length === 0) return;

      const saleIds = mySales.map(sale => sale.id);
      
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
  }, [mySales]);

  // Calcular estatísticas
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todaySales = mySales.filter(sale => sale.date >= startOfDay);
  const todayRevenue = todaySales.reduce((acc, sale) => acc + sale.total, 0);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthSales = mySales.filter(sale => sale.date >= startOfMonth);
  const monthRevenue = monthSales.reduce((acc, sale) => acc + sale.total, 0);

  const handleSendThankYou = () => {
    if (!selectedSale || !thankYouMessage.trim()) return;

    // Simular envio da mensagem
    toast({
      title: "Mensagem enviada!",
      description: `Mensagem de agradecimento enviada para ${selectedSale.customer.name}`,
    });

    setThankYouMessage('');
    setIsDialogOpen(false);
    setSelectedSale(null);
  };

  const openThankYouDialog = (sale) => {
    setSelectedSale(sale);
    setThankYouMessage(`Olá ${sale.customer.name}! Muito obrigado(a) pela sua compra. Foi um prazer atendê-lo(a)! Esperamos vê-lo(a) novamente em breve. 😊`);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Vendas</h1>
        <p className="text-muted-foreground">
          Acompanhe seu desempenho e histórico de vendas, {user?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Hoje
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales.length}</div>
            <p className="text-xs text-muted-foreground">
              vendas realizadas hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              em vendas hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas do Mês
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthSales.length}</div>
            <p className="text-xs text-muted-foreground">
              vendas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              faturamento mensal
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Suas vendas realizadas com opção de agradecimento aos clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mySales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma venda realizada ainda.</p>
              <p className="text-sm">Suas vendas aparecerão aqui quando forem registradas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySales.map((sale) => (
                <Card key={sale.id} className="card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {sale.customer.name}
                          {sale.customer.isGeneric && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Cliente Padrão</span>
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
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-xl font-bold text-store-green-600">
                            R$ {sale.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {sale.paymentMethod === 'pix' ? 'PIX' : 
                             sale.paymentMethod === 'debito' ? 'Débito' : 'Crédito'}
                          </p>
                        </div>
                        {!sale.customer.isGeneric && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openThankYouDialog(sale)}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Agradecer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
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
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mensagem de Agradecimento</DialogTitle>
            <DialogDescription>
              Envie uma mensagem de agradecimento para {selectedSale?.customer.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
              placeholder="Digite sua mensagem de agradecimento..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendThankYou} disabled={!thankYouMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySalesPage;
