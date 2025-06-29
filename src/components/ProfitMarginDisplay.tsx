
import React from 'react';
import { calculateProfitMargin, formatCurrency, formatPercentage } from '@/utils/profitCalculations';

interface ProfitMarginDisplayProps {
  salePrice: number;
  costPrice: number;
  className?: string;
}

export const ProfitMarginDisplay: React.FC<ProfitMarginDisplayProps> = ({ 
  salePrice, 
  costPrice, 
  className = "" 
}) => {
  const margin = calculateProfitMargin(salePrice, costPrice);
  
  const getMarginColor = (percentage: number) => {
    if (percentage < 10) return 'text-red-600';
    if (percentage < 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Lucro:</span>
        <span className={`font-semibold ${getMarginColor(margin.profitPercentage)}`}>
          {formatCurrency(margin.profitAmount)}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Margem:</span>
        <span className={`font-semibold ${getMarginColor(margin.profitPercentage)}`}>
          {formatPercentage(margin.profitPercentage)}
        </span>
      </div>
    </div>
  );
};
