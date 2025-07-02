
import React, { createContext, useContext, useState } from 'react';
import { 
  Product, 
  Customer, 
  Seller, 
  User, 
  Sale, 
  SaleItem, 
  DeleteLog,
  StoreSettings,
  NotificationSettings,
  SecuritySettings,
  RoleSettings
} from '@/types/store';
import {
  initialProducts,
  initialCustomers,
  initialSellers,
  initialUsers,
  initialStoreSettings,
  initialNotificationSettings,
  initialSecuritySettings,
  initialCategories,
  initialCollections,
  initialSuppliers,
  initialBrands,
  initialCities,
  initialColors,
  initialSizes,
  initialRoleSettings
} from '@/data/initialData';
import { useStoreOperations } from '@/hooks/useStoreOperations';
import { useProductsLogic } from '@/hooks/useProductsLogic';
import { useCustomersLogic } from '@/hooks/useCustomersLogic';
import { useUsersLogic } from '@/hooks/useUsersLogic';
import { useSalesLogic } from '@/hooks/useSalesLogic';
import { useDataManagementLogic } from '@/hooks/useDataManagementLogic';
import { useSettingsLogic } from '@/hooks/useSettingsLogic';

// Re-export types for backward compatibility
export type {
  Product,
  Customer,
  Seller,
  User,
  Sale,
  SaleItem,
  DeleteLog,
  StoreSettings,
  NotificationSettings,
  SecuritySettings,
  RoleSettings
} from '@/types/store';

interface StoreContextType {
  // Products
  products: Product[];
  deleteLogs: DeleteLog[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string, userId: string, userName: string, reason?: string) => void;
  bulkUpdateProducts: (productIds: string[], updates: Partial<Product>) => void;
  searchProducts: (query: string) => Product[];
  searchProductByBarcode: (barcode: string) => Product | null;
  createTemporaryProduct: (barcode: string, price?: number) => Product;
  getIncompleteProducts: () => Product[];
  duplicateProduct: (product: Product) => Omit<Product, 'id'>;
  isBarcodeTaken: (barcode: string, excludeId?: string) => boolean;
  hasProductBeenSold: (productId: string) => boolean;
  getLowStockProducts: () => Product[];
  
  // All other properties from original context
  customers: Customer[];
  sellers: Seller[];
  users: User[];
  sales: Sale[];
  categories: string[];
  collections: string[];
  suppliers: string[];
  brands: string[];
  cities: string[];
  colors: string[];
  sizes: string[];
  storeSettings: StoreSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  importedXmlHashes: string[];
  roleSettings: RoleSettings;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addSeller: (seller: Omit<Seller, 'id'>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string) => string;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  searchCustomers: (query: string) => Customer[];
  addCategory: (category: string) => void;
  updateCategory: (index: number, newCategory: string) => void;
  removeCategory: (index: number) => void;
  addCollection: (collection: string) => void;
  updateCollection: (index: number, newCollection: string) => void;
  removeCollection: (index: number) => void;
  addSupplier: (supplier: string) => void;
  updateSupplier: (index: number, newSupplier: string) => void;
  removeSupplier: (index: number) => void;
  addBrand: (brand: string) => void;
  updateBrand: (index: number, newBrand: string) => void;
  removeBrand: (index: number) => void;
  addColor: (color: string) => void;
  updateColor: (index: number, newColor: string) => void;
  removeColor: (index: number) => void;
  addSize: (size: string) => void;
  updateSize: (index: number, newSize: string) => void;
  removeSize: (index: number) => void;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  updateRoleSettings: (settings: RoleSettings) => void;
  isXmlAlreadyImported: (xmlHash: string) => boolean;
  markXmlAsImported: (xmlHash: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize all state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [collections, setCollections] = useState<string[]>(initialCollections);
  const [suppliers, setSuppliers] = useState<string[]>(initialSuppliers);
  const [brands, setBrands] = useState<string[]>(initialBrands);
  const [cities, setCities] = useState<string[]>(initialCities);
  const [colors, setColors] = useState<string[]>(initialColors);
  const [sizes, setSizes] = useState<string[]>(initialSizes);
  const [deleteLogs, setDeleteLogs] = useState<DeleteLog[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(initialStoreSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
  const [importedXmlHashes, setImportedXmlHashes] = useState<string[]>([]);
  const [roleSettings, setRoleSettings] = useState<RoleSettings>(initialRoleSettings);

  // Use custom hooks for business logic
  const operations = useStoreOperations();
  const productsLogic = useProductsLogic(products, setProducts, deleteLogs, setDeleteLogs, sales, operations, categories, setCategories);
  const customersLogic = useCustomersLogic(customers, setCustomers, cities, setCities, operations);
  const usersLogic = useUsersLogic(users, setUsers, operations);
  const salesLogic = useSalesLogic(sales, setSales, operations, productsLogic.updateProduct);
  const dataManagementLogic = useDataManagementLogic({
    categories, setCategories,
    collections, setCollections,
    suppliers, setSuppliers,
    brands, setBrands,
    colors, setColors,
    sizes, setSizes
  });
  const settingsLogic = useSettingsLogic({
    storeSettings, setStoreSettings,
    notificationSettings, setNotificationSettings,
    securitySettings, setSecuritySettings,
    roleSettings, setRoleSettings,
    importedXmlHashes, setImportedXmlHashes
  });

  return (
    <StoreContext.Provider value={{
      // Products
      products,
      deleteLogs,
      ...productsLogic,
      
      // Customers
      customers,
      ...customersLogic,
      
      // Users
      users,
      ...usersLogic,
      
      // Sales
      sales,
      ...salesLogic,
      
      // Sellers
      sellers,
      addSeller: (seller: Omit<Seller, 'id'>) => {
        const newSeller = { ...seller, id: operations.generateUniqueId() };
        setSellers(prev => [...prev, newSeller]);
      },
      
      // Data Management
      categories,
      collections,
      suppliers,
      brands,
      cities,
      colors,
      sizes,
      ...dataManagementLogic,
      
      // Settings
      storeSettings,
      notificationSettings,
      securitySettings,
      roleSettings,
      importedXmlHashes,
      ...settingsLogic
    }}>
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
