
export interface ProfitMargin {
  profitAmount: number;
  profitPercentage: number;
}

export const calculateProfitMargin = (salePrice: number, costPrice: number): ProfitMargin => {
  const profitAmount = salePrice - costPrice;
  const profitPercentage = salePrice > 0 ? (profitAmount / salePrice) * 100 : 0;
  
  return {
    profitAmount: Math.round(profitAmount * 100) / 100, // Round to 2 decimal places
    profitPercentage: Math.round(profitPercentage * 100) / 100 // Round to 2 decimal places
  };
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
