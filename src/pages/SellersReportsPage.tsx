import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSales } from '@/contexts/SalesContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriodFilter } from '@/hooks/usePeriodFilter';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import PeriodFilter from '@/components/dashboard/PeriodFilter';

interface SellerStats {
  sellerId: string;
  sellerName: string;
  totalSales: number;
  totalValue: number;
  averageTicket: number;
  percentage: number;
}

const SellersReportsPage = () => {
  const { sales } = useSales();
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

  const getSellerStats = (): SellerStats[] => {
    const sellerStats = filteredSales.reduce((acc, sale) => {
      const sellerId = sale.seller;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          sellerId,
          sellerName: sellerId,
          totalSales: 0,
          totalValue: 0
        };
      }
      acc[sellerId].totalSales += 1;
      acc[sellerId].totalValue += sale.total;
      return acc;
    }, {} as Record<string, Omit<SellerStats, 'averageTicket' | 'percentage'>>);

    const totalValue = Object.values(sellerStats).reduce((sum, seller) => sum + seller.totalValue, 0);
    
    return Object.values(sellerStats)
      .map(seller => ({
        ...seller,
        averageTicket: seller.totalSales > 0 ? seller.totalValue / seller.totalSales : 0,
        percentage: totalValue > 0 ? (seller.totalValue / totalValue) * 100 : 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  };

  const sellerStats = getSellerStats();
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400" />;
      case 2: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">{position + 1}º</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatório de Vendedores</h1>
            <p className="text-gray-600">Performance dos vendedores no período</p>
          </div>
        </div>
      </div>

      {/* Filtros de Período */}
      <PeriodFilter
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        customDateRange={customDateRange}
        onCustomDateChange={setCustomDateRange}
      />

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-store-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'all' ? 'Todas as vendas' : 'Vendas no período'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-store-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'all' ? 'Total faturado' : 'Faturado no período'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-store-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerStats.length}</div>
            <p className="text-xs text-muted-foreground">
              Vendedores com vendas no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Vendedores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-store-blue-600" />
            Ranking de Vendedores
          </CardTitle>
          <CardDescription>
            Performance dos vendedores ordenada por faturamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sellerStats.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma venda realizada no período</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sellerStats.map((seller, index) => (
                <div key={seller.sellerId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {getRankIcon(index)}
                    <div>
                      <h3 className="font-semibold text-lg">{seller.sellerName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{seller.totalSales} venda{seller.totalSales !== 1 ? 's' : ''}</span>
                        <span>Ticket médio: R$ {seller.averageTicket.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-store-green-600">
                      R$ {seller.totalValue.toFixed(2)}
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {seller.percentage.toFixed(1)}% do total
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Performance (futuro) */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Performance</CardTitle>
          <CardDescription>
            Gráficos e análises detalhadas (em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Gráficos e análises avançadas serão implementados em breve</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellersReportsPage; 