
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

// Export types that are used in other components
export type { Product, Customer, Sale, User } from '@/types/store';

export interface SaleItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

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
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => Promise<void>;
  importProducts: (products: Omit<Product, 'id'>[]) => Promise<void>;
  duplicateProduct: (product: Product) => Product;
  isBarcodeTaken: (barcode: string, excludeId?: string) => boolean;
  hasProductBeenSold: (productId: string) => boolean;
  searchProducts: (query: string) => Product[];
  createTemporaryProduct: (barcode: string, price: number) => Product;
  getLowStockProducts: () => Product[];
  
  // Customer operations
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  searchCustomers: (query: string) => Customer[];
  
  // Sales operations
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  
  // User operations
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (userId: string) => void;
  
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
  removeCategory: (index: number) => void;
  removeCollection: (index: number) => void;
  removeSupplier: (index: number) => void;
  removeBrand: (index: number) => void;
  removeColor: (index: number) => void;
  removeSize: (index: number) => void;
  
  // Settings operations
  updateStoreSettings: (settings: StoreSettings) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateSecuritySettings: (settings: SecuritySettings) => void;
  updateRoleSettings: (settings: RoleSettings) => void;
  
  // XML Import operations
  isXmlAlreadyImported: (hash: string) => boolean;
  markXmlAsImported: (hash: string) => void;
  
  // Utility operations
  generateUniqueId: () => string;
  refreshData: () => Promise<void>;
  refreshSales: () => Promise<void>;
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
    { ...operations, loadSales: supabaseStore.loadSales },
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

  const settingsLogic = useSettingsLogic({
    storeSettings: supabaseStore.storeSettings,
    setStoreSettings: supabaseStore.setStoreSettings,
    notificationSettings: supabaseStore.notificationSettings,
    setNotificationSettings: supabaseStore.setNotificationSettings,
    securitySettings: supabaseStore.securitySettings,
    setSecuritySettings: supabaseStore.setSecuritySettings,
    roleSettings: null,
    setRoleSettings: () => {},
    importedXmlHashes: supabaseStore.importedXmlHashes,
    setImportedXmlHashes: supabaseStore.setImportedXmlHashes
  });

  // Helper functions
  const duplicateProduct = (product: Product): Product => {
    return {
      ...product,
      id: operations.generateUniqueId(),
      name: `${product.name} (Cópia)`,
      barcode: `${product.barcode}_copy_${Date.now()}`,
      quantity: 0
    };
  };

  const isBarcodeTaken = (barcode: string, excludeId?: string): boolean => {
    return supabaseStore.products.some(p => p.barcode === barcode && p.id !== excludeId);
  };

  const hasProductBeenSold = (productId: string): boolean => {
    return supabaseStore.sales.some(sale => 
      sale.items?.some(item => item.product.id === productId)
    );
  };

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return supabaseStore.products;
    
    const searchTerm = query.toLowerCase();
    return supabaseStore.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.barcode.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  };

  const createTemporaryProduct = (barcode: string, price: number): Product => {
    const tempProduct: Product = {
      id: operations.generateUniqueId(),
      name: `Produto Temporário - ${barcode}`,
      description: 'Produto adicionado durante a venda',
      price: price,
      costPrice: 0,
      category: 'Temporário',
      collection: 'Temporário',
      size: 'Único',
      supplier: 'Temporário',
      brand: 'Temporário',
      quantity: 999,
      image: '',
      barcode: barcode,
      color: 'Não especificado',
      gender: 'Unissex'
    };
    
    // Add to products list temporarily
    supabaseStore.setProducts(prev => [...prev, tempProduct]);
    
    return tempProduct;
  };

  const getLowStockProducts = (): Product[] => {
    const lowStockThreshold = supabaseStore.notificationSettings?.low_stock_quantity || 5;
    return supabaseStore.products.filter(product => product.quantity <= lowStockThreshold);
  };

  const isXmlAlreadyImported = (hash: string): boolean => {
    return supabaseStore.importedXmlHashes.includes(hash);
  };

  const markXmlAsImported = (hash: string): void => {
    supabaseStore.setImportedXmlHashes(prev => [...prev, hash]);
  };

  const resetUserPassword = (userId: string): void => {
    // Implementation would depend on your auth system
    console.log('Reset password for user:', userId);
  };

  // Remove operations (for compatibility with management pages)
  const removeCategory = (index: number) => {
    const categoryName = supabaseStore.categories[index];
    if (categoryName) {
      dataManagementLogic.deleteCategory(categoryName);
    }
  };

  const removeCollection = (index: number) => {
    const collectionName = supabaseStore.collections[index];
    if (collectionName) {
      dataManagementLogic.deleteCollection(collectionName);
    }
  };

  const removeSupplier = (index: number) => {
    const supplierName = supabaseStore.suppliers[index];
    if (supplierName) {
      dataManagementLogic.deleteSupplier(supplierName);
    }
  };

  const removeBrand = (index: number) => {
    const brandName = supabaseStore.brands[index];
    if (brandName) {
      dataManagementLogic.deleteBrand(brandName);
    }
  };

  const removeColor = (index: number) => {
    const colorName = supabaseStore.colors[index];
    if (colorName) {
      dataManagementLogic.deleteColor(colorName);
    }
  };

  const removeSize = (index: number) => {
    const sizeName = supabaseStore.sizes[index];
    if (sizeName) {
      dataManagementLogic.deleteSize(sizeName);
    }
  };

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
    
    // Additional helper functions
    duplicateProduct,
    isBarcodeTaken,
    hasProductBeenSold,
    searchProducts,
    createTemporaryProduct,
    getLowStockProducts,
    isXmlAlreadyImported,
    markXmlAsImported,
    resetUserPassword,
    
    // Remove operations for backward compatibility
    removeCategory,
    removeCollection,
    removeSupplier,
    removeBrand,
    removeColor,
    removeSize,
    
    // Bulk operations
    bulkUpdateProducts: productsLogic.bulkEditProducts,
    
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
    refreshData: supabaseStore.loadAllData,
    refreshSales: supabaseStore.loadSales
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
