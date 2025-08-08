
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingCart, Users, Package, CreditCard, DollarSign } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useSales } from '@/contexts/SalesContext';
import { useCustomers } from '@/contexts/CustomersContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CustomerSelectionSection } from '@/components/sales/CustomerSelectionSection';
import { SellerSelectionSection } from '@/components/sales/SellerSelectionSection';
import { ProductAdditionSection } from '@/components/sales/ProductAdditionSection';
import { ProductListSection } from '@/components/sales/ProductListSection';
import { SaleFinalizationSection } from '@/components/sales/SaleFinalizationSection';
import { SaleConfirmation } from '@/components/sales/SaleConfirmation';
import { SalesList } from '@/components/sales/SalesList';
import { StockAlertSection } from '@/components/sales/StockAlertSection';
import type { Product, SaleItem } from '@/types/store';
import { sanitizeName, sanitizeText, sanitizeNumber } from '@/utils/sanitization';
import { useInventoryControl } from '@/hooks/useInventoryControl';

const SalesPage = () => {
  const { products, searchProducts, createTemporaryProduct } = useProducts();
  const { sales, addSale, refreshSales } = useSales();
  const { customers, searchCustomers } = useCustomers();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    canAddProduct,
    canUpdateQuantity,
    getAvailableStock,
    canFinalizeSale,
    showStockWarnings,
    showStockErrors,
    updateStockAfterSale
  } = useInventoryControl();
  
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);
  
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

  const hasProducts = selectedProducts.length > 0;

  const handleCustomerSearch = (query: string) => {
    setCustomerSearch(query);
    
    // Busca em tempo real se tiver mais de 1 caractere
    if (query.length > 1) {
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

    // Calcular quantidade atual no carrinho
    const currentInCart = selectedProducts
      .filter(item => item.product.id === productId)
      .reduce((total, item) => total + item.quantity, 0);

    // Verificar se pode adicionar
    const stockCheck = canAddProduct(product, currentInCart, 1);

    if (!stockCheck.allowed) {
      toast({
        title: "Produto não pode ser adicionado",
        description: stockCheck.reason,
        variant: "destructive",
      });
      return;
    }

    // Mostrar aviso se necessário
    if (stockCheck.warning) {
      toast({
        title: "Aviso de Estoque",
        description: stockCheck.warning,
        variant: "destructive",
      });
    }

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
          id: Date.now().toString(),
          product,
          quantity: 1,
          price: product.price
        }]);
      }
      return;
    }

    // Para produtos normais, verificar estoque
    const existingItem = selectedProducts.find(item => item.product.id === productId);
    if (existingItem) {
      setSelectedProducts(prev => prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedProducts(prev => [...prev, {
        id: Date.now().toString(),
        product,
        quantity: 1,
        price: product.price
      }]);
    }

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado à venda`,
    });
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
      // Verificar se pode atualizar quantidade
      const stockCheck = canUpdateQuantity(product, newQuantity);

      if (!stockCheck.allowed) {
        toast({
          title: "Quantidade não pode ser alterada",
          description: stockCheck.reason,
          variant: "destructive",
        });
        return;
      }

      // Mostrar aviso se necessário
      if (stockCheck.warning) {
        toast({
          title: "Aviso de Estoque",
          description: stockCheck.warning,
          variant: "destructive",
        });
      }

      // Para produtos temporários, permitir qualquer quantidade
      if (product.category === 'Temporário' || stockCheck.allowed) {
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

  const handleFinalizeSale = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para a venda",
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

    // Verificar estoque antes de finalizar
    const stockCheck = canFinalizeSale(selectedProducts);
    
    if (!stockCheck.allowed) {
      showStockErrors(stockCheck.issues);
      return;
    }

    // Mostrar avisos de estoque se houver
    if (stockCheck.warnings.length > 0) {
      showStockWarnings(stockCheck.warnings);
    }

    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const total = getTotalSale();

    // Sanitizar dados da venda
    const sanitizedSale = {
      customer: {
        ...selectedCustomer,
        name: sanitizeName(selectedCustomer.name),
        email: selectedCustomer.email ? sanitizeText(selectedCustomer.email) : '',
        phone: selectedCustomer.phone ? sanitizeText(selectedCustomer.phone) : '',
        address: selectedCustomer.address ? sanitizeText(selectedCustomer.address) : '',
        notes: selectedCustomer.notes ? sanitizeText(selectedCustomer.notes) : ''
      },
      items: selectedProducts.map(item => ({
        ...item,
        name: sanitizeName(item.product.name),
        description: item.product.description ? sanitizeText(item.product.description) : '',
        category: sanitizeName(item.product.category),
        brand: item.product.brand ? sanitizeName(item.product.brand) : '',
        color: item.product.color ? sanitizeName(item.product.color) : '',
        size: item.product.size ? sanitizeName(item.product.size) : '',
        price: sanitizeNumber(item.price),
        quantity: sanitizeNumber(item.quantity)
      })),
      subtotal: sanitizeNumber(subtotal),
      discount: sanitizeNumber(discountAmount),
      discountType: discount.type,
      total: sanitizeNumber(total),
      paymentMethod,
      seller: sanitizeName(selectedSeller),
      cashier: sanitizeName(user?.name || 'Sistema')
    };
    
    addSale(sanitizedSale);
    
    // Atualizar estoque após venda (AGORA É ASYNC)
    await updateStockAfterSale(selectedProducts);
    
    // Refresh das vendas após adicionar uma nova
    setTimeout(() => {
      refreshSales();
    }, 1000);
    
    // Buscar a venda recém-criada para passar completa para o componente
    const newSale = {
      ...sanitizedSale,
      id: Date.now().toString(),
      date: new Date()
    };
    
    setCompletedSale(newSale);
    setShowConfirmation(true);
    
    // Fechar a janela de venda imediatamente
    setIsSaleDialogOpen(false);
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
    setCompletedSale(null);
    setIsSaleDialogOpen(false);
    setShowConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetSale();
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
                {/* Cliente e Vendedor lado a lado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CustomerSelectionSection
                    selectedCustomer={selectedCustomer}
                    customerSearch={customerSearch}
                    customerSuggestions={customerSuggestions}
                    onCustomerSearch={handleCustomerSearch}
                    onSelectCustomer={handleSelectCustomer}
                    onCustomerNotWantRegister={handleCustomerNotWantRegister}
                  />

                  <SellerSelectionSection
                    selectedSeller={selectedSeller}
                    onSellerChange={setSelectedSeller}
                  />
                </div>

                {/* Seção de Produtos */}
                <ProductAdditionSection
                  productSearch={productSearch}
                  products={products}
                  onProductSearchChange={setProductSearch}
                  onProductSelect={handleProductSelect}
                  onCreateTemporary={handleCreateTemporaryProduct}
                />

                <ProductListSection
                  selectedProducts={selectedProducts}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdatePrice={handleUpdatePrice}
                  onRemoveProduct={handleRemoveProduct}
                />

                {/* Alertas de Estoque */}
                {selectedProducts.length > 0 && (
                  <StockAlertSection selectedProducts={selectedProducts} />
                )}

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
        onClose={handleCloseConfirmation}
        onNewSale={resetSale}
        onBackToDashboard={() => {
          resetSale();
        }}
        sale={completedSale}
      />

      {/* Lista de vendas recentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vendas Recentes</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshSales}
            className="text-sm"
          >
            🔄 Atualizar
          </Button>
        </div>
        <SalesList sales={sales} />
      </div>
    </div>
  );
};

export default SalesPage;
