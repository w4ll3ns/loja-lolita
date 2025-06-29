import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStore, SaleItem, Product } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { QuickCustomerForm } from '@/components/sales/QuickCustomerForm';
import { SaleConfirmation } from '@/components/sales/SaleConfirmation';
import { SaleFinalizationSection } from '@/components/sales/SaleFinalizationSection';
import { Search, ShoppingCart, Barcode, User, Users, Plus } from 'lucide-react';
import { ProductAutocomplete } from '@/components/ui/product-autocomplete';
import { cn } from '@/lib/utils';

const SalesPage = () => {
  const { products, customers, sellers, sales, searchCustomers, searchProducts, createTemporaryProduct, addSale } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
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
  const [productSearch, setProductSearch] = useState('');

  const activeSellers = sellers.filter(s => s.active);
  const hasProducts = selectedProducts.length > 0;

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

  const handleProductSelect = (product: Product) => {
    handleAddProduct(product.id);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado à venda`,
    });
  };

  const handleCreateTemporaryProduct = (barcode: string, price: number) => {
    const temporaryProduct = createTemporaryProduct(barcode, price);
    handleAddProduct(temporaryProduct.id);
    toast({
      title: "Produto temporário adicionado",
      description: `Produto com código ${barcode} foi criado e adicionado à venda`,
      variant: "default",
    });
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Para produtos temporários, sempre permitir adicionar
    if (product.category === 'Temporário') {
      const existingItem = selectedProducts.find(item => item.product.id === productId);
      if (existingItem) {
        setSelectedProducts(prev => prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setSelectedProducts(prev => [...prev, {
          product,
          quantity: 1,
          price: product.price
        }]);
      }
      return;
    }

    // Para produtos normais, verificar estoque
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
    if (product) {
      // Para produtos temporários, permitir qualquer quantidade
      if (product.category === 'Temporário' || newQuantity <= product.quantity) {
        setSelectedProducts(prev => prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      }
    }
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    if (newPrice > 0) {
      setSelectedProducts(prev => prev.map(item =>
        item.product.id === productId
          ? { ...item, price: newPrice }
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

  const handleFinalizeSale = () => {
    if (!selectedCustomer) {
      toast({
        title: "Erro",
        description: "Selecione um cliente ou marque que não quis se cadastrar",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSeller) {
      toast({
        title: "Erro",
        description: "Selecione o vendedor responsável",
        variant: "destructive",
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto à venda",
        variant: "destructive",
      });
      return;
    }

    // Verificar se todos os produtos têm preço definido
    const productsWithoutPrice = selectedProducts.filter(item => item.price <= 0);
    if (productsWithoutPrice.length > 0) {
      toast({
        title: "Erro",
        description: "Todos os produtos devem ter um preço definido",
        variant: "destructive",
      });
      return;
    }

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
    setSelectedCustomer(null);
    setSelectedSeller('');
    setSelectedProducts([]);
    setPaymentMethod('pix');
    setDiscount({ value: 0, type: 'percentage' });
    setCustomerSearch('');
    setProductSearch('');
    setCustomerSuggestions([]);
    setIsSaleDialogOpen(false);
    setShowConfirmation(false);
  };

  const canMakeSale = user?.role === 'admin' || user?.role === 'caixa';

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
              <Button className="bg-store-green-600 hover:bg-store-green-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Venda</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Linha 1: Cliente e Vendedor lado a lado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Seleção do Cliente */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Cliente
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>Buscar Cliente</Label>
                      <div className="relative">
                        <Input
                          placeholder="Nome ou WhatsApp..."
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
                                <p className="font-medium text-sm">{customer.name}</p>
                                <p className="text-xs text-muted-foreground">{customer.whatsapp}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedCustomer && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="font-medium text-green-800 text-sm">Cliente Selecionado:</p>
                        <p className="text-green-700 text-sm">{selectedCustomer.name} - {selectedCustomer.whatsapp}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Popover open={showCustomerForm} onOpenChange={setShowCustomerForm}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Plus className="h-4 w-4 mr-1" />
                            Novo Cliente
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
                        size="sm"
                        onClick={handleCustomerNotWantRegister}
                        className="flex-1"
                      >
                        Não Quis Cadastrar
                      </Button>
                    </div>
                  </div>

                  {/* Seleção do Vendedor */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Vendedor
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>Vendedor Responsável</Label>
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
                </div>

                {/* Linha 2: Campo de Código de Barras */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Barcode className="h-5 w-5" />
                    Adicionar Produtos
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Código de Barras ou Nome do Produto</Label>
                    <ProductAutocomplete
                      value={productSearch}
                      onChange={setProductSearch}
                      products={products}
                      placeholder="Digite o código de barras ou nome do produto..."
                      onProductSelect={handleProductSelect}
                      onCreateTemporary={handleCreateTemporaryProduct}
                      className="text-center"
                    />
                  </div>

                  {/* Lista de Produtos Adicionados */}
                  {selectedProducts.length > 0 && (
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
                                    onChange={(e) => handleUpdatePrice(item.product.id, parseFloat(e.target.value) || 0)}
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
                                onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                                className="w-14 text-xs"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveProduct(item.product.id)}
                                className="h-8 w-8 p-0"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Área de Finalização */}
                <div className="border-t pt-4">
                  <SaleFinalizationSection
                    hasProducts={hasProducts}
                    discount={discount}
                    paymentMethod={paymentMethod}
                    subtotal={getSubtotal()}
                    discountAmount={getDiscountAmount()}
                    total={getTotalSale()}
                    onDiscountChange={setDiscount}
                    onPaymentMethodChange={setPaymentMethod}
                    onFinalizeSale={handleFinalizeSale}
                    disabled={!selectedCustomer || !selectedSeller}
                  />
                </div>
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
