
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore, SaleItem } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingCart, User, Users } from 'lucide-react';

const SalesPage = () => {
  const { products, customers, sales, addSale, addCustomer, searchCustomers } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [wantToRegister, setWantToRegister] = useState(true);
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    whatsapp: '',
    gender: 'M' as 'M' | 'F' | 'Outro',
    city: ''
  });

  const [saleData, setSaleData] = useState({
    paymentMethod: 'pix' as 'pix' | 'debito' | 'credito',
    seller: ''
  });

  const availableProducts = products.filter(p => p.quantity > 0);

  const handleCustomerSearch = (query: string) => {
    setCustomerSearch(query);
    if (query.length > 2) {
      const suggestions = searchCustomers(query);
      setCustomerSuggestions(suggestions);
      setShowNewCustomerForm(suggestions.length === 0);
    } else {
      setCustomerSuggestions([]);
      setShowNewCustomerForm(false);
    }
    setSelectedCustomer(null);
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setCustomerSuggestions([]);
    setShowNewCustomerForm(false);
  };

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

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

  const getTotalSale = () => {
    return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleFinalizeSale = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto à venda",
        variant: "destructive",
      });
      return;
    }

    if (!saleData.seller) {
      toast({
        title: "Erro",
        description: "Selecione um vendedor",
        variant: "destructive",
      });
      return;
    }

    let finalCustomer = selectedCustomer;

    if (!selectedCustomer) {
      if (wantToRegister && showNewCustomerForm) {
        if (!newCustomer.name || !newCustomer.whatsapp) {
          toast({
            title: "Erro",
            description: "Preencha os dados do cliente",
            variant: "destructive",
          });
          return;
        }
        
        addCustomer(newCustomer);
        finalCustomer = { ...newCustomer, id: Date.now().toString() };
      } else {
        // Cliente genérico
        finalCustomer = customers.find(c => c.isGeneric);
      }
    }

    const sale = {
      customer: finalCustomer,
      items: selectedProducts,
      total: getTotalSale(),
      paymentMethod: saleData.paymentMethod,
      seller: saleData.seller,
      cashier: user?.name || 'Sistema'
    };

    addSale(sale);

    toast({
      title: "Sucesso",
      description: "Venda finalizada com sucesso!",
    });

    // Reset form
    setSelectedProducts([]);
    setCustomerSearch('');
    setSelectedCustomer(null);
    setNewCustomer({ name: '', whatsapp: '', gender: 'M', city: '' });
    setSaleData({ paymentMethod: 'pix', seller: '' });
    setIsSaleDialogOpen(false);
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Venda</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seleção de produtos */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Produtos</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {availableProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {product.price.toFixed(2)} - {product.quantity} disponível
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddProduct(product.id)}
                          className="bg-store-blue-600 hover:bg-store-blue-700"
                        >
                          Adicionar
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Produtos selecionados */}
                  {selectedProducts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Produtos Selecionados</h4>
                      {selectedProducts.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between p-2 bg-muted rounded">
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
                      <div className="text-right font-semibold text-lg">
                        Total: R$ {getTotalSale().toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dados da venda */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Dados da Venda</h3>

                  {/* Busca de cliente */}
                  <div className="space-y-2">
                    <Label>Cliente</Label>
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

                  {/* Novo cliente ou cliente genérico */}
                  {showNewCustomerForm && (
                    <div className="space-y-4 p-4 border rounded">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={wantToRegister}
                          onChange={(e) => setWantToRegister(e.target.checked)}
                        />
                        <Label>Cliente quer se cadastrar</Label>
                      </div>

                      {wantToRegister ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Nome do cliente"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          />
                          <Input
                            placeholder="WhatsApp"
                            value={newCustomer.whatsapp}
                            onChange={(e) => setNewCustomer({ ...newCustomer, whatsapp: e.target.value })}
                          />
                          <Select onValueChange={(value: 'M' | 'F' | 'Outro') => setNewCustomer({ ...newCustomer, gender: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sexo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              <SelectItem value="M">Masculino</SelectItem>
                              <SelectItem value="F">Feminino</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Cidade (opcional)"
                            value={newCustomer.city}
                            onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Venda será associada ao cliente padrão
                        </p>
                      )}
                    </div>
                  )}

                  {/* Vendedor */}
                  <div className="space-y-2">
                    <Label>Vendedor *</Label>
                    <Input
                      placeholder="Nome do vendedor"
                      value={saleData.seller}
                      onChange={(e) => setSaleData({ ...saleData, seller: e.target.value })}
                    />
                  </div>

                  {/* Forma de pagamento */}
                  <div className="space-y-2">
                    <Label>Forma de Pagamento</Label>
                    <Select onValueChange={(value: 'pix' | 'debito' | 'credito') => setSaleData({ ...saleData, paymentMethod: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="debito">Débito</SelectItem>
                        <SelectItem value="credito">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleFinalizeSale}
                    className="w-full bg-store-green-600 hover:bg-store-green-700"
                    disabled={selectedProducts.length === 0}
                  >
                    Finalizar Venda - R$ {getTotalSale().toFixed(2)}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Lista de vendas */}
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
                      <CardTitle className="text-lg">{sale.customer.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {sale.date.toLocaleDateString()} - {sale.date.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-store-green-600">
                        R$ {sale.total.toFixed(2)}
                      </p>
                      <Badge variant="outline" className="capitalize">
                        {sale.paymentMethod}
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
