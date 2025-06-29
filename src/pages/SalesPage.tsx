
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStore, SaleItem } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { QuickCustomerForm } from '@/components/sales/QuickCustomerForm';
import { SaleConfirmation } from '@/components/sales/SaleConfirmation';
import { Search, ShoppingCart, Barcode, User, Users, Plus, Percent, DollarSign } from 'lucide-react';

type SaleStep = 'customer' | 'seller' | 'products' | 'payment';

const SalesPage = () => {
  const { products, customers, sellers, sales, searchCustomers, searchProductByBarcode, addSale } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<SaleStep>('customer');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Estados da venda
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'debito' | 'credito'>('pix');
  const [discount, setDiscount] = useState({ value: 0, type: 'percentage' as 'percentage' | 'value' });
  
  // Estados de busca
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [barcode, setBarcode] = useState('');

  const activeSellers = sellers.filter(s => s.active);

  const handleCustomerSearch = (query: string) => {
    setCustomerSearch(query);
    if (query.length > 2) {
      const suggestions = searchCustomers(query);
      setCustomerSuggestions(suggestions);
    } else {
      setCustomerSuggestions([]);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setCustomerSuggestions([]);
  };

  const handleCustomerNotWantRegister = () => {
    const genericCustomer = customers.find(c => c.isGeneric);
    setSelectedCustomer({ ...genericCustomer, wantedToRegister: false });
  };

  const handleBarcodeInput = (barcodeValue: string) => {
    setBarcode(barcodeValue);
    
    if (barcodeValue.length >= 8) {
      const product = searchProductByBarcode(barcodeValue);
      if (product) {
        handleAddProduct(product.id);
        setBarcode('');
        toast({
          title: "Produto adicionado",
          description: `${product.name} foi adicionado à venda`,
        });
      } else {
        toast({
          title: "Produto não encontrado",
          description: "Código de barras não encontrado no sistema",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.quantity <= 0) {
      toast({
        title: "Produto sem estoque",
        description: "Este produto não possui estoque disponível",
        variant: "destructive",
      });
      return;
    }

    const existingItem = selectedProducts.find(item => item.product.id === productId);
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setSelectedProducts(prev => prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setSelectedProducts(prev => [...prev, {
        product,
        quantity: 1,
        price: product.price
      }]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.quantity) {
      setSelectedProducts(prev => prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getSubtotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    if (discount.type === 'percentage') {
      return (subtotal * discount.value) / 100;
    }
    return discount.value;
  };

  const getTotalSale = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const handleNextStep = () => {
    if (currentStep === 'customer' && !selectedCustomer) {
      toast({
        title: "Erro",
        description: "Selecione um cliente ou marque que não quis se cadastrar",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 'seller' && !selectedSeller) {
      toast({
        title: "Erro",
        description: "Selecione o vendedor responsável",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 'products' && selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto à venda",
        variant: "destructive",
      });
      return;
    }

    const steps: SaleStep[] = ['customer', 'seller', 'products', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    const steps: SaleStep[] = ['customer', 'seller', 'products', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleFinalizeSale = () => {
    const selectedSellerData = sellers.find(s => s.id === selectedSeller);
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const total = getTotalSale();

    const sale = {
      customer: selectedCustomer,
      items: selectedProducts,
      subtotal,
      discount: discountAmount,
      discountType: discount.type,
      total,
      paymentMethod,
      seller: selectedSellerData?.name || '',
      cashier: user?.name || 'Sistema'
    };

    addSale(sale);
    
    setShowConfirmation(true);
  };

  const resetSale = () => {
    setCurrentStep('customer');
    setSelectedCustomer(null);
    setSelectedSeller('');
    setSelectedProducts([]);
    setPaymentMethod('pix');
    setDiscount({ value: 0, type: 'percentage' });
    setCustomerSearch('');
    setBarcode('');
    setCustomerSuggestions([]);
    setIsSaleDialogOpen(false);
    setShowConfirmation(false);
  };

  const canMakeSale = user?.role === 'admin' || user?.role === 'caixa';

  const stepTitles = {
    customer: '1. Seleção do Cliente',
    seller: '2. Vendedor Responsável',
    products: '3. Adição de Produtos',
    payment: '4. Finalização'
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600">Gerencie as vendas da loja</p>
        </div>
        {canMakeSale && (
          <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-store-green-600 hover:bg-store-green-700" onClick={() => setCurrentStep('customer')}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{stepTitles[currentStep]}</DialogTitle>
              </DialogHeader>
              
              {/* Etapa 1: Seleção do Cliente */}
              {currentStep === 'customer' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Buscar Cliente
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Digite o nome ou WhatsApp do cliente..."
                        value={customerSearch}
                        onChange={(e) => handleCustomerSearch(e.target.value)}
                      />
                      {customerSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                          {customerSuggestions.map((customer) => (
                            <div
                              key={customer.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectCustomer(customer)}
                            >
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.whatsapp}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCustomer && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="font-medium text-green-800">Cliente Selecionado:</p>
                      <p className="text-green-700">{selectedCustomer.name} - {selectedCustomer.whatsapp}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Popover open={showCustomerForm} onOpenChange={setShowCustomerForm}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Cadastrar Novo Cliente
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <QuickCustomerForm
                          onClose={() => setShowCustomerForm(false)}
                          onCustomerCreated={handleSelectCustomer}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleCustomerNotWantRegister}
                      className="flex-1"
                    >
                      Cliente Não Quis se Cadastrar
                    </Button>
                  </div>
                </div>
              )}

              {/* Etapa 2: Seleção do Vendedor */}
              {currentStep === 'seller' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Vendedor Responsável
                    </Label>
                    <Select onValueChange={setSelectedSeller} value={selectedSeller}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o vendedor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {activeSellers.map((seller) => (
                          <SelectItem key={seller.id} value={seller.id}>
                            {seller.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Etapa 3: Adição de Produtos */}
              {currentStep === 'products' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Barcode className="h-4 w-4" />
                      Código de Barras
                    </Label>
                    <Input
                      placeholder="Digite ou escaneie o código de barras..."
                      value={barcode}
                      onChange={(e) => handleBarcodeInput(e.target.value)}
                      className="text-center font-mono"
                      autoFocus
                    />
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Produtos Adicionados</h4>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {selectedProducts.map((item) => (
                          <div key={item.product.id} className="flex items-center justify-between p-3 bg-muted rounded border">
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                R$ {item.price.toFixed(2)} cada
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                max={item.product.quantity}
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                                className="w-16"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveProduct(item.product.id)}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label>Desconto</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={discount.value}
                                onChange={(e) => setDiscount({ ...discount, value: Number(e.target.value) })}
                                className="flex-1"
                              />
                              <Select 
                                value={discount.type} 
                                onValueChange={(value: 'percentage' | 'value') => setDiscount({ ...discount, type: value })}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white z-50">
                                  <SelectItem value="percentage">
                                    <Percent className="h-4 w-4" />
                                  </SelectItem>
                                  <SelectItem value="value">
                                    <DollarSign className="h-4 w-4" />
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Subtotal: R$ {getSubtotal().toFixed(2)}
                          </p>
                          {getDiscountAmount() > 0 && (
                            <p className="text-sm text-red-600">
                              Desconto: -R$ {getDiscountAmount().toFixed(2)}
                            </p>
                          )}
                          <p className="text-xl font-bold text-store-green-600">
                            Total: R$ {getTotalSale().toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Etapa 4: Finalização */}
              {currentStep === 'payment' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Forma de Pagamento</Label>
                    <Select value={paymentMethod} onValueChange={(value: 'pix' | 'debito' | 'credito') => setPaymentMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="debito">Cartão de Débito</SelectItem>
                        <SelectItem value="credito">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted rounded border">
                    <h4 className="font-medium mb-2">Resumo da Venda</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cliente:</span>
                        <span>{selectedCustomer?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendedor:</span>
                        <span>{sellers.find(s => s.id === selectedSeller)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Itens:</span>
                        <span>{selectedProducts.length} produto(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>R$ {getSubtotal().toFixed(2)}</span>
                      </div>
                      {getDiscountAmount() > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Desconto:</span>
                          <span>-R$ {getDiscountAmount().toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-1">
                        <span>Total:</span>
                        <span className="text-store-green-600">R$ {getTotalSale().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de navegação */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                  disabled={currentStep === 'customer'}
                >
                  Voltar
                </Button>
                
                {currentStep === 'payment' ? (
                  <Button 
                    onClick={handleFinalizeSale}
                    className="bg-store-green-600 hover:bg-store-green-700"
                  >
                    Finalizar Venda
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextStep}
                    className="bg-store-blue-600 hover:bg-store-blue-700"
                  >
                    Próximo
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Confirmação de venda */}
      <SaleConfirmation
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onNewSale={resetSale}
        onBackToDashboard={() => {
          resetSale();
          // Navegar para dashboard se necessário
        }}
        saleTotal={getTotalSale()}
        customerWhatsApp={selectedCustomer?.whatsapp}
      />

      {/* Lista de vendas recentes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vendas Recentes</h2>
        {sales.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma venda realizada</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SalesPage;
