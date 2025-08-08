
import { Sale } from '@/types/store';

export const useSalesLogic = (
  sales: Sale[],
  setSales: (fn: (prev: Sale[]) => Sale[]) => void,
  operations: any,
  updateProduct: (id: string, updates: any) => void
) => {
  const addSale = async (sale: Omit<Sale, 'id' | 'date'>) => {
    const result = await operations.addSale(sale);
    if (result) {
      // The database operations are handled in useSupabaseOperations
      // We need to reload sales to get the full sale with items
      await operations.loadSales?.();
    }
  };

  const refreshSales = async () => {
    if (operations.loadSales) {
      await operations.loadSales();
    }
  };

  return {
    addSale,
    refreshSales
  };
};
