
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { Sale } from '@/types/store';

interface SellerRankingData {
  sellerId: string;
  sellerName: string;
  totalSales: number;
  totalValue: number;
  percentage: number;
}

interface SellersRankingProps {
  sales: Sale[];
  onClick: () => void;
}

const SellersRanking: React.FC<SellersRankingProps> = ({ sales, onClick }) => {
  const getRankingData = (): SellerRankingData[] => {
    const sellerStats = sales.reduce((acc, sale) => {
      const sellerId = sale.seller;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          sellerId,
          sellerName: sellerId,
          totalSales: 0,
          totalValue: 0,
        };
      }
      acc[sellerId].totalSales += 1;
      acc[sellerId].totalValue += sale.total;
      return acc;
    }, {} as Record<string, Omit<SellerRankingData, 'percentage'>>);

    const totalValue = Object.values(sellerStats).reduce((sum, seller) => sum + seller.totalValue, 0);
    
    return Object.values(sellerStats)
      .map(seller => ({
        ...seller,
        percentage: totalValue > 0 ? (seller.totalValue / totalValue) * 100 : 0,
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  };

  const ranking = getRankingData();
  const topSellers = ranking.slice(0, 3);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Award className="h-5 w-5 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <Card className="card-hover cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-store-blue-600" />
          Ranking de Vendedores
        </CardTitle>
        <CardDescription>
          Top vendedores do período
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topSellers.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma venda realizada no período</p>
        ) : (
          <div className="space-y-3">
            {topSellers.map((seller, index) => (
              <div key={seller.sellerId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <div>
                    <p className="font-medium">{seller.sellerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {seller.totalSales} venda{seller.totalSales !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-store-green-600">
                    R$ {seller.totalValue.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {seller.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellersRanking;
