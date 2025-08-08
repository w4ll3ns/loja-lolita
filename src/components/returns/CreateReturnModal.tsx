import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useReturnsLogic } from '@/hooks/useReturnsLogic';
import { useToast } from '@/hooks/use-toast';
import { Sale, Product } from '@/types/store';
import { ReturnType, ReturnReason, RefundMethod, CreateReturnData } from '@/types/returns';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  ArrowLeftRight, 
  Search, 
  Plus, 
  Minus, 
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface CreateReturnModalProps {
  open: boolean;
  onClose: () => void;
  sales: Sale[];
  onSuccess: () => void;
}

interface SelectedSaleItem {
  saleItemId: string;
  product: Product;
  quantity: number;
  originalPrice: number;
  refundPrice: number;
  conditionDescription: string;
}

interface ExchangeItem {
  originalProduct: Product;
  newProduct: Product;
  quantity: number;
  priceDifference: number;
}

const CreateReturnModal = ({ open, onClose, sales, onSuccess }: CreateReturnModalProps) => {
  const { user } = useAuth();
  const { createReturn } = useReturnsLogic();
  const { toast } = useToast();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [returnType, setReturnType] = useState<ReturnType>('return');
  const [returnReason, setReturnReason] = useState<ReturnReason>('not_liked');
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('same_payment');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedSaleItem[]>([]);
  const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedSale(null);
      setReturnType('return');
      setReturnReason('not_liked');
      setRefundMethod('same_payment');
      setNotes('');
      setSelectedItems([]);
      setExchangeItems([]);
      setSearchTerm('');
    }
  }, [open]);

  // Estado para armazenar vendas que já têm devoluções
  const [salesWithReturns, setSalesWithReturns] = useState<Set<string>>(new Set());

  // Verificar quais vendas têm devoluções
  useEffect(() => {
    const checkReturnsForSales = async () => {
      if (sales.length === 0) return;

      const saleIds = sales.map(sale => sale.id);
      
      try {
        const { data: returns, error } = await supabase
          .from('returns')
          .select('sale_id, status')
          .in('sale_id', saleIds)
          .in('status', ['approved', 'completed']);

        if (error) {
          console.error('Error checking returns:', error);
          return;
        }

        // Criar um Set com os IDs das vendas que têm devoluções aprovadas ou completadas
        const salesWithReturnsSet = new Set(returns.map((r: any) => r.sale_id));
        setSalesWithReturns(salesWithReturnsSet);
      } catch (error) {
        console.error('Error checking returns:', error);
      }
    };

    checkReturnsForSales();
  }, [sales]);

  // Filtrar vendas baseado no termo de busca e verificar se já foram devolvidas
  const filteredSales = sales.filter(sale => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      sale.customer.name.toLowerCase().includes(searchLower) ||
      sale.id.toLowerCase().includes(searchLower)
    );
    
    // Verificar se a venda já tem devoluções aprovadas ou completadas
    const hasReturns = salesWithReturns.has(sale.id);
    
    return matchesSearch && !hasReturns;
  });

  const handleSaleSelect = (sale: Sale) => {
    setSelectedSale(sale);
    setSelectedItems([]);
    setExchangeItems([]);
  };

  const handleItemSelect = (item: any, quantity: number) => {
    const existingItem = selectedItems.find(i => i.saleItemId === item.id);
    
    if (existingItem) {
      setSelectedItems(prev => prev.map(i => 
        i.saleItemId === item.id 
          ? { ...i, quantity: Math.min(quantity, item.quantity) }
          : i
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        saleItemId: item.id,
        product: item.product,
        quantity: Math.min(quantity, item.quantity),
        originalPrice: item.price,
        refundPrice: item.price,
        conditionDescription: ''
      }]);
    }
  };

  const handleItemQuantityChange = (saleItemId: string, quantity: number) => {
    // Encontrar o item original da venda para obter a quantidade máxima disponível
    const originalSaleItem = selectedSale?.items.find(item => item.id === saleItemId);
    const maxQuantity = originalSaleItem?.quantity || 1;
    
    setSelectedItems(prev => prev.map(item => 
      item.saleItemId === saleItemId 
        ? { ...item, quantity: Math.max(1, Math.min(quantity, maxQuantity)) }
        : item
    ));
  };

  const handleItemRemove = (saleItemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.saleItemId !== saleItemId));
    setExchangeItems(prev => prev.filter(item => item.originalProduct.id !== saleItemId));
  };

  const handleRefundPriceChange = (saleItemId: string, price: number) => {
    // Encontrar o item original da venda para obter o preço máximo
    const originalSaleItem = selectedSale?.items.find(item => item.id === saleItemId);
    const maxPrice = originalSaleItem?.price || 0;
    
    setSelectedItems(prev => prev.map(item => 
      item.saleItemId === saleItemId 
        ? { ...item, refundPrice: Math.max(0, Math.min(price, maxPrice)) }
        : item
    ));
  };

  const handleConditionChange = (saleItemId: string, condition: string) => {
    setSelectedItems(prev => prev.map(item => 
      item.saleItemId === saleItemId 
        ? { ...item, conditionDescription: condition }
        : item
    ));
  };

  const handleExchangeProductSelect = (originalProductId: string, newProduct: Product) => {
    const originalItem = selectedItems.find(item => item.product.id === originalProductId);
    if (!originalItem) return;

    const priceDifference = newProduct.price - originalItem.originalPrice;
    
    setExchangeItems(prev => {
      const filtered = prev.filter(item => item.originalProduct.id !== originalProductId);
      return [...filtered, {
        originalProduct: originalItem.product,
        newProduct,
        quantity: originalItem.quantity,
        priceDifference
      }];
    });
  };

  const handleSubmit = async () => {
    if (!selectedSale || selectedItems.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione uma venda e pelo menos um item",
        variant: "destructive"
      });
      return;
    }

    if (!user?.name) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive"
      });
      return;
    }

    try {
      const returnData: CreateReturnData = {
        sale_id: selectedSale.id,
        customer_id: selectedSale.customer.id,
        return_type: returnType,
        return_reason: returnReason,
        refund_method: refundMethod,
        notes,
        items: selectedItems.map(item => ({
          sale_item_id: item.saleItemId, // Este será o índice que será usado para encontrar o sale_item real
          product_id: item.product.id,
          quantity: item.quantity,
          original_price: item.originalPrice,
          refund_price: item.refundPrice,
          condition_description: item.conditionDescription
        })),
        exchange_items: returnType === 'exchange' ? exchangeItems.map(item => ({
          original_product_id: item.originalProduct.id,
          new_product_id: item.newProduct.id,
          quantity: item.quantity,
          price_difference: item.priceDifference
        })) : undefined
      };

      const result = await createReturn(returnData, user.name);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "Devolução criada com sucesso"
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating return:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar devolução",
        variant: "destructive"
      });
    }
  };

  const getReasonText = (reason: ReturnReason) => {
    switch (reason) {
      case 'defective': return 'Defeituoso';
      case 'wrong_size': return 'Tamanho errado';
      case 'wrong_color': return 'Cor errada';
      case 'not_liked': return 'Não gostou';
      case 'other': return 'Outro';
      default: return reason;
    }
  };

  const getRefundMethodText = (method: RefundMethod) => {
    switch (method) {
      case 'same_payment': return 'Mesmo método de pagamento';
      case 'store_credit': return 'Crédito da loja';
      case 'exchange': return 'Troca';
      default: return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {returnType === 'return' ? <Package className="h-5 w-5" /> : <ArrowLeftRight className="h-5 w-5" />}
            Nova {returnType === 'return' ? 'Devolução' : 'Troca'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de Venda */}
          {!selectedSale ? (
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Venda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por cliente ou ID da venda..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredSales.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma venda disponível para devolução</p>
                        <p className="text-sm">Vendas já devolvidas não aparecem nesta lista</p>
                      </div>
                    ) : (
                      filteredSales.map((sale) => (
                      <Card 
                        key={sale.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSaleSelect(sale)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{sale.customer.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(sale.date).toLocaleDateString('pt-BR')} • {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-muted-foreground">ID: {sale.id.slice(0, 8)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">R$ {sale.total.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">{sale.paymentMethod}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Informações da Venda Selecionada */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Venda Selecionada</span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSale(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">{selectedSale.customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedSale.date).toLocaleDateString('pt-BR')} às {new Date(selectedSale.date).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {selectedSale.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{selectedSale.paymentMethod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configurações da Devolução */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={returnType} onValueChange={(value: ReturnType) => setReturnType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="return">Devolução</SelectItem>
                          <SelectItem value="exchange">Troca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Motivo</Label>
                      <Select value={returnReason} onValueChange={(value: ReturnReason) => setReturnReason(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="defective">Defeituoso</SelectItem>
                          <SelectItem value="wrong_size">Tamanho errado</SelectItem>
                          <SelectItem value="wrong_color">Cor errada</SelectItem>
                          <SelectItem value="not_liked">Não gostou</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Método de Reembolso</Label>
                      <Select value={refundMethod} onValueChange={(value: RefundMethod) => setRefundMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same_payment">Mesmo método</SelectItem>
                          <SelectItem value="store_credit">Crédito da loja</SelectItem>
                          <SelectItem value="exchange">Troca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      placeholder="Observações sobre a devolução..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Seleção de Itens */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Itens da Venda</span>
                    {selectedItems.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selecionado{selectedItems.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSale.items.map((item) => {
                      const selectedItem = selectedItems.find(i => i.saleItemId === item.id);
                      const isSelected = !!selectedItem;
                      
                      return (
                        <Card key={item.id} className={isSelected ? "border-blue-500 bg-blue-50" : ""}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.product.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Quantidade vendida: {item.quantity} • Preço original: R$ {item.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                  💡 Você pode devolver de 1 a {item.quantity} unidade(s)
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Categoria: {item.product.category} • Tamanho: {item.product.size}
                                </p>
                                {item.product.barcode && (
                                  <p className="text-xs text-muted-foreground font-mono">
                                    Código: {item.product.barcode}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {!isSelected ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleItemSelect(item, item.quantity)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleItemQuantityChange(item.id, selectedItem.quantity - 1)}
                                      disabled={selectedItem.quantity <= 1}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">{selectedItem.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleItemQuantityChange(item.id, selectedItem.quantity + 1)}
                                      disabled={selectedItem.quantity >= item.quantity}
                                      title={`Máximo: ${item.quantity}`}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleItemRemove(item.id)}
                                      className="text-red-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="mt-4 space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm">Preço de Reembolso (máx: R$ {item.price.toFixed(2)})</Label>
                                    <Input
                                      type="number"
                                      value={selectedItem.refundPrice}
                                      onChange={(e) => handleRefundPriceChange(item.id, parseFloat(e.target.value) || 0)}
                                      className="h-8"
                                      max={item.price}
                                      step="0.01"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm">Condição</Label>
                                    <Input
                                      placeholder="Descreva a condição..."
                                      value={selectedItem.conditionDescription}
                                      onChange={(e) => handleConditionChange(item.id, e.target.value)}
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Resumo */}
              {selectedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo da {returnType === 'return' ? 'Devolução' : 'Troca'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Itens Selecionados:</h4>
                        <div className="space-y-2">
                          {selectedItems.map((item) => (
                            <div key={item.saleItemId} className="flex justify-between items-center">
                              <span>{item.product.name} (x{item.quantity})</span>
                              <span>R$ {(item.refundPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total a Reembolsar:</span>
                          <span>R$ {selectedItems.reduce((sum, item) => sum + (item.refundPrice * item.quantity), 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Informações sobre o impacto */}
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h5 className="font-medium text-blue-800 mb-2">📊 Impacto da Devolução:</h5>
                        <div className="space-y-1 text-sm text-blue-700">
                          <p>• <strong>Estoque:</strong> {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} unidade(s) será(ão) adicionada(s) ao estoque</p>
                          <p>• <strong>Venda Original:</strong> Será marcada como "Devolvida Parcialmente"</p>
                          <p>• <strong>Valor da Venda:</strong> Permanecerá R$ {selectedSale.total.toFixed(2)} (sem alteração)</p>
                          <p>• <strong>Valor Devolvido:</strong> R$ {selectedItems.reduce((sum, item) => sum + (item.refundPrice * item.quantity), 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Botões */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={selectedItems.length === 0}
                  className="bg-store-blue-600 hover:bg-store-blue-700"
                >
                  Criar {returnType === 'return' ? 'Devolução' : 'Troca'}
                  {selectedItems.length > 0 && (
                    <span className="ml-2">
                      ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReturnModal; 