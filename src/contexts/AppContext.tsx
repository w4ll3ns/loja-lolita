import React, { ReactNode } from 'react';
import { ProductsProvider } from './ProductsContext';
import { SalesProvider } from './SalesContext';
import { CustomersProvider } from './CustomersContext';
import { SettingsProvider } from './SettingsContext';
import { DataManagementProvider } from './DataManagementContext';

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  return (
    <ProductsProvider>
      <SalesProvider>
        <CustomersProvider>
          <SettingsProvider>
            <DataManagementProvider>
              {children}
            </DataManagementProvider>
          </SettingsProvider>
        </CustomersProvider>
      </SalesProvider>
    </ProductsProvider>
  );
};

