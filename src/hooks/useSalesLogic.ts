
import { Sale } from '@/types/store';

export const useSalesLogic = (
  sales: Sale[],
  setSales: (fn: (prev: Sale[]) => Sale[]) => void,
  operations: any,
  updateProduct: (id: string, updates: any) => void
) => {
  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale = { ...sale, id: operations.generateUniqueId(), date: new Date() };
    setSales(prev => [newSale, ...prev]);
    
    sale.items.forEach(item => {
      if (item.product.category === 'Temporário' && item.product.quantity === 1) {
        updateProduct(item.product.id, { 
          description: `Produto criado em venda - ${newSale.date.toLocaleDateString()} - Necessita edição completa`
        });
      } else {
        updateProduct(item.product.id, { 
          quantity: Math.max(0, item.product.quantity - item.quantity)
        });
      }
    });
  };

  return {
    addSale
  };
};
