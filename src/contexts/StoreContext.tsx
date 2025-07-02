
import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';
import { useSupabaseOperations } from '@/hooks/useSupabaseOperations';
import { useProductsLogic } from '@/hooks/useProductsLogic';
import { useCustomersLogic } from '@/hooks/useCustomersLogic';
import { useSalesLogic } from '@/hooks/useSalesLogic';
import { useUsersLogic } from '@/hooks/useUsersLogic';
import { useDataManagementLogic } from '@/hooks/useDataManagementLogic';
import { useSettingsLogic } from '@/hooks/useSettingsLogic';
import { Product, Customer, Sale, User, Seller, DeleteLog, StoreSettings, NotificationSettings, SecuritySettings, RoleSettings } from '@/types/store';

interface StoreContextType {
  // Data
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  users: User[];
  sellers: Seller[];
  deleteLogs: DeleteLog[];
  storeSettings: StoreSettings | null;
  notificationSettings: NotificationSettings | null;
  securitySettings: SecuritySettings | null;
  roleSettings: RoleSettings | null;
  
  // Dropdown data
  categories: string[];
  collections: string[];
  suppliers: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  cities: string[];

  // Product operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string, reason?: string, requirePassword?: boolean) => Promise<void>;
  bulkEditProducts: (ids: string[], updates: Partial<Product>) => Promise<void>;
  importProducts: (products: Omit<Product, 'id'>[]) => Promise<void>;
  
  // Customer operations
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  searchCustomers: (query: string) => Customer[];
  
  // Sales operations
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  
  // User operations
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Seller operations
  addSeller: (seller: Omit<Seller, 'id'>) => void;
  updateSeller: (id: string, updates: Partial<Seller>) => void;
  deleteSeller: (id: string) => void;
  
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
  
  // Settings operations
  updateStoreSettings: (settings: StoreSettings) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateSecuritySettings: (settings: SecuritySettings) => void;
  updateRoleSettings: (settings: RoleSettings) => void;
  
  // Utility operations
  generateUniqueId: () => string;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const supabaseStore = useSupabaseStore();
  const operations = useSupabaseOperations();
  
  // Initialize logic hooks with Supabase data and operations
  const productsLogic = useProductsLogic(
    supabaseStore.products,
    supabaseStore.setProducts,
    supabaseStore.categories,
    supabaseStore.setCategories,
    supabaseStore.collections,
    supabaseStore.setCollections,
    supabaseStore.suppliers,
    supabaseStore.setSuppliers,
    supabaseStore.brands,
    supabaseStore.setBrands,
    supabaseStore.colors,
    supabaseStore.setColors,
    supabaseStore.sizes,
    supabaseStore.setSizes,
    operations
  );

  const customersLogic = useCustomersLogic(
    supabaseStore.customers,
    supabaseStore.setCustomers,
    supabaseStore.cities,
    supabaseStore.setCities,
    operations
  );

  const salesLogic = useSalesLogic(
    supabaseStore.sales,
    supabaseStore.setSales,
    operations,
    productsLogic.updateProduct
  );

  const usersLogic = useUsersLogic(
    supabaseStore.users,
    supabaseStore.setUsers,
    operations
  );

  const dataManagementLogic = useDataManagementLogic(
    {
      categories: supabaseStore.categories,
      collections: supabaseStore.collections,
      suppliers: supabaseStore.suppliers,
      brands: supabaseStore.brands,
      colors: supabaseStore.colors,
      sizes: supabaseStore.sizes
    },
    {
      setCategories: supabaseStore.setCategories,
      setCollections: supabaseStore.setCollections,
      setSuppliers: supabaseStore.setSuppliers,
      setBrands: supabaseStore.setBrands,
      setColors: supabaseStore.setColors,
      setSizes: supabaseStore.setSizes
    },
    operations
  );

  const settingsLogic = useSettingsLogic(
    supabaseStore.storeSettings,
    supabaseStore.setStoreSettings,
    supabaseStore.notificationSettings,
    supabaseStore.setNotificationSettings,
    supabaseStore.securitySettings,
    supabaseStore.setSecuritySettings
  );

  const contextValue: StoreContextType = {
    // Data from Supabase
    products: supabaseStore.products,
    customers: supabaseStore.customers,
    sales: supabaseStore.sales,
    users: supabaseStore.users,
    sellers: supabaseStore.sellers,
    deleteLogs: [], // Will be implemented later
    storeSettings: supabaseStore.storeSettings,
    notificationSettings: supabaseStore.notificationSettings,
    securitySettings: supabaseStore.securitySettings,
    roleSettings: null, // Will be implemented later
    
    // Dropdown data
    categories: supabaseStore.categories,
    collections: supabaseStore.collections,
    suppliers: supabaseStore.suppliers,
    brands: supabaseStore.brands,
    colors: supabaseStore.colors,
    sizes: supabaseStore.sizes,
    cities: supabaseStore.cities,

    // Operations from logic hooks
    ...productsLogic,
    ...customersLogic,
    ...salesLogic,
    ...usersLogic,
    ...dataManagementLogic,
    ...settingsLogic,
    
    // Seller operations (basic implementation)
    addSeller: (seller) => {
      const newSeller = { ...seller, id: operations.generateUniqueId() };
      supabaseStore.setSellers(prev => [...prev, newSeller]);
    },
    updateSeller: (id, updates) => {
      supabaseStore.setSellers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    },
    deleteSeller: (id) => {
      supabaseStore.setSellers(prev => prev.filter(s => s.id !== id));
    },
    
    // Utility operations
    generateUniqueId: operations.generateUniqueId,
    refreshData: supabaseStore.loadAllData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
