import React, { createContext, useContext, ReactNode } from 'react';
import { useDataManagementLogic } from '@/hooks/useDataManagementLogic';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';

interface DataManagementContextType {
  // Dropdown data
  categories: string[];
  collections: string[];
  suppliers: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  cities: string[];
  
  // Data management operations
  addCategory: (name: string) => Promise<void>;
  addCollection: (name: string) => Promise<void>;
  addSupplier: (name: string) => Promise<void>;
  addBrand: (name: string) => Promise<void>;
  addColor: (name: string) => Promise<void>;
  addSize: (name: string) => Promise<void>;
  updateCategory: (oldName: string, newName: string) => void;
  updateCollection: (oldName: string, newName: string) => void;
  updateSupplier: (oldName: string, newName: string) => void;
  updateBrand: (oldName: string, newName: string) => void;
  updateColor: (oldName: string, newName: string) => void;
  updateSize: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  deleteCollection: (name: string) => void;
  deleteSupplier: (name: string) => void;
  deleteBrand: (name: string) => void;
  deleteColor: (name: string) => void;
  deleteSize: (name: string) => void;
  removeCategory: (index: number) => void;
  removeCollection: (index: number) => void;
  removeSupplier: (index: number) => void;
  removeBrand: (index: number) => void;
  removeColor: (index: number) => void;
  removeSize: (index: number) => void;
}

const DataManagementContext = createContext<DataManagementContextType | undefined>(undefined);

interface DataManagementProviderProps {
  children: ReactNode;
}

export const DataManagementProvider: React.FC<DataManagementProviderProps> = ({ children }) => {
  const supabaseStore = useSupabaseStore();
  const dataManagementLogic = useDataManagementLogic();

  const contextValue: DataManagementContextType = {
    // Dropdown data
    categories: supabaseStore.categories,
    collections: supabaseStore.collections,
    suppliers: supabaseStore.suppliers,
    brands: supabaseStore.brands,
    colors: supabaseStore.colors,
    sizes: supabaseStore.sizes,
    cities: supabaseStore.cities,
    
    // Operations from logic hooks
    ...dataManagementLogic,
  };

  return (
    <DataManagementContext.Provider value={contextValue}>
      {children}
    </DataManagementContext.Provider>
  );
};

export const useDataManagement = () => {
  const context = useContext(DataManagementContext);
  if (context === undefined) {
    throw new Error('useDataManagement must be used within a DataManagementProvider');
  }
  return context;
};

