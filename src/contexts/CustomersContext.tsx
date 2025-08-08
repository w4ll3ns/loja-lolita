import React, { createContext, useContext, ReactNode } from 'react';
import { Customer } from '@/types/store';
import { useCustomersLogic } from '@/hooks/useCustomersLogic';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';
import { useSupabaseOperations } from '@/hooks/useSupabaseOperations';

interface CustomersContextType {
  // Data
  customers: Customer[];
  
  // Operations
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  searchCustomers: (query: string) => Customer[];
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

interface CustomersProviderProps {
  children: ReactNode;
}

export const CustomersProvider: React.FC<CustomersProviderProps> = ({ children }) => {
  const supabaseStore = useSupabaseStore();
  const supabaseOperations = useSupabaseOperations();
  const customersLogic = useCustomersLogic(
    supabaseStore.customers,
    supabaseStore.setCustomers,
    supabaseStore.cities,
    supabaseStore.setCities,
    supabaseOperations
  );

  const contextValue: CustomersContextType = {
    // Data
    customers: supabaseStore.customers,
    
    // Operations from logic hooks
    ...customersLogic,
  };

  return (
    <CustomersContext.Provider value={contextValue}>
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};
