import React, { createContext, useContext, ReactNode } from 'react';
import { Sale, Seller } from '@/types/store';
import { useSalesLogic } from '@/hooks/useSalesLogic';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';
import { useSupabaseOperations } from '@/hooks/useSupabaseOperations';

interface SalesContextType {
  // Data
  sales: Sale[];
  sellers: Seller[];
  
  // Operations
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  
  // Utility operations
  refreshSales: () => Promise<void>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

interface SalesProviderProps {
  children: ReactNode;
}

export const SalesProvider: React.FC<SalesProviderProps> = ({ children }) => {
  const supabaseStore = useSupabaseStore();
  const supabaseOperations = useSupabaseOperations();
  const salesLogic = useSalesLogic(
    supabaseStore.sales,
    supabaseStore.setSales,
    supabaseOperations,
    supabaseOperations.updateProduct
  );

  const contextValue: SalesContextType = {
    // Data
    sales: supabaseStore.sales,
    sellers: supabaseStore.sellers,
    
    // Operations from logic hooks
    ...salesLogic,
  };

  return (
    <SalesContext.Provider value={contextValue}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
