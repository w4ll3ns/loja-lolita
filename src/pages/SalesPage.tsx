
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore, Product, SaleItem } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SaleConfirmation } from '@/components/sales/SaleConfirmation';
import { SaleFinalizationSection } from '@/components/sales/SaleFinalizationSection';
import { CustomerSelectionSection } from '@/components/sales/CustomerSelectionSection';
import { SellerSelectionSection } from '@/components/sales/SellerSelectionSection';
import { ProductAdditionSection } from '@/components/sales/ProductAdditionSection';
import { ProductListSection } from '@/components/sales/ProductListSection';
import { SalesList } from '@/components/sales/SalesList';
import { ShoppingCart } from 'lucide-react';

const SalesPage = () => {
  const { products, customers, sellers, sales, searchCustomers, searchProducts, createTemporaryProduct, addSale } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
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
    
    // Buscar a venda recém-criada para passar completa para o componente
    const newSale = {
      ...sale,
      id: Date.now().toString(),
      date: new Date()
    };
    
    setCompletedSale(newSale);
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
    setCompletedSale(null);
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
        sale={completedSale}
      />

      {/* Lista de vendas recentes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vendas Recentes</h2>
        <SalesList sales={sales} />
      </div>
    </div>
  );
};

export default SalesPage;
