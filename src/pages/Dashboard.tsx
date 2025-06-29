
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriodFilter } from '@/hooks/usePeriodFilter';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import PeriodFilter from '@/components/dashboard/PeriodFilter';
import SellersRanking from '@/components/dashboard/SellersRanking';

const Dashboard = () => {
  const { products, customers, sales } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    filterByPeriod
  } = usePeriodFilter();

  // Filtrar vendas pelo período selecionado
  const filteredSales = filterByPeriod(sales);

  const totalProducts = products.length;
  const totalCustomers = customers.filter(c => !c.isGeneric).length;
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);

  const lowStockProducts = products.filter(p => p.quantity <= 5);
  const recentSales = filteredSales.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
          </div>
        </div>

        {/* Filtros de Período */}
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          customDateRange={customDateRange}
          onCustomDateChange={setCustomDateRange}
        />
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover cursor-pointer" onClick={() => navigate('/products')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-store-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockProducts.length} com estoque baixo
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => navigate('/customers')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-store-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => navigate('/sales')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-store-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'all' ? 'Total de vendas' : 'Vendas no período'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-store-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'all' ? 'Total faturado' : 'Faturado no período'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos com estoque baixo */}
        <Card className="cursor-pointer card-hover" onClick={() => navigate('/products')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Estoque Baixo
            </CardTitle>
            <CardDescription>
              Produtos que precisam de reposição
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground">Nenhum produto com estoque baixo</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{product.quantity} unidades</p>
                      <p className="text-sm text-muted-foreground">R$ {product.price}</p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{lowStockProducts.length - 5} outros produtos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vendas recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>
              {selectedPeriod === 'all' ? 'Últimas vendas realizadas' : 'Vendas do período selecionado'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSales.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma venda realizada{selectedPeriod !== 'all' ? ' no período' : ''}</p>
            ) : (
              <div className="space-y-2">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{sale.customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.items.length} item(s) - {sale.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-store-green-600">R$ {sale.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{sale.seller}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ranking de Vendedores */}
        <SellersRanking 
          sales={filteredSales} 
          onClick={() => navigate('/my-sales')} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
