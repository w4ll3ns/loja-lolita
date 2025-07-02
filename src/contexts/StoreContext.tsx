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
  SecuritySettings
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
  initialSizes
} from '@/data/initialData';
import { useStoreOperations } from '@/hooks/useStoreOperations';

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
  SecuritySettings
} from '@/types/store';

interface StoreContextType {
  products: Product[];
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
  deleteLogs: DeleteLog[];
  storeSettings: StoreSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  importedXmlHashes: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string, userId: string, userName: string, reason?: string) => void;
  bulkUpdateProducts: (productIds: string[], updates: Partial<Product>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addSeller: (seller: Omit<Seller, 'id'>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string) => string;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  searchCustomers: (query: string) => Customer[];
  searchProductByBarcode: (barcode: string) => Product | null;
  searchProducts: (query: string) => Product[];
  createTemporaryProduct: (barcode: string, price?: number) => Product;
  addCategory: (category: string) => void;
  addCollection: (collection: string) => void;
  addSupplier: (supplier: string) => void;
  addBrand: (brand: string) => void;
  addColor: (color: string) => void;
  addSize: (size: string) => void;
  getIncompleteProducts: () => Product[];
  duplicateProduct: (product: Product) => Omit<Product, 'id'>;
  isBarcodeTaken: (barcode: string, excludeId?: string) => boolean;
  hasProductBeenSold: (productId: string) => boolean;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  getLowStockProducts: () => Product[];
  isXmlAlreadyImported: (xmlHash: string) => boolean;
  markXmlAsImported: (xmlHash: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const operations = useStoreOperations();

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: operations.generateUniqueId() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const bulkUpdateProducts = (productIds: string[], updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      productIds.includes(p.id) ? { ...p, ...updates } : p
    ));
  };

  const deleteProduct = (id: string, userId: string, userName: string, reason?: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const requiresPassword = operations.hasProductBeenSold(sales, id);
    
    const deleteLog: DeleteLog = {
      id: operations.generateUniqueId(),
      productId: id,
      productName: product.name,
      userId,
      userName,
      date: new Date(),
      reason,
      requiredPassword: requiresPassword
    };

    setDeleteLogs(prev => [...prev, deleteLog]);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = { 
      ...user, 
      id: operations.generateUniqueId(),
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
    console.log('Usuário criado:', newUser);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    console.log('Usuário atualizado:', id, updates);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    console.log('Usuário removido:', id);
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: operations.generateUniqueId() };
    setCustomers(prev => [...prev, newCustomer]);
    
    if (customer.city && !cities.includes(customer.city)) {
      setCities(prev => [...prev, customer.city!]);
    }
  };

  const addSeller = (seller: Omit<Seller, 'id'>) => {
    const newSeller = { ...seller, id: operations.generateUniqueId() };
    setSellers(prev => [...prev, newSeller]);
  };

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

  const createTemporaryProduct = (barcode: string, price: number = 0): Product => {
    const temporaryProduct = operations.createTemporaryProduct(barcode, price);
    setProducts(prev => [...prev, temporaryProduct]);
    
    if (!categories.includes('Temporário')) {
      setCategories(prev => [...prev, 'Temporário']);
    }
    
    return temporaryProduct;
  };

  const addColor = (color: string) => {
    if (!colors.includes(color)) {
      setColors(prev => [...prev, color]);
    }
  };

  const addSize = (size: string) => {
    if (!sizes.includes(size)) {
      setSizes(prev => [...prev, size]);
    }
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const addCollection = (collection: string) => {
    if (!collections.includes(collection)) {
      setCollections(prev => [...prev, collection]);
    }
  };

  const addSupplier = (supplier: string) => {
    if (!suppliers.includes(supplier)) {
      setSuppliers(prev => [...prev, supplier]);
    }
  };

  const addBrand = (brand: string) => {
    if (!brands.includes(brand)) {
      setBrands(prev => [...prev, brand]);
    }
  };

  const updateStoreSettings = (settings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...settings }));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
    console.log('Configurações de notificações atualizadas:', settings);
  };

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...settings }));
    console.log('Configurações de segurança atualizadas:', settings);
  };

  const isXmlAlreadyImported = (xmlHash: string): boolean => {
    return importedXmlHashes.includes(xmlHash);
  };

  const markXmlAsImported = (xmlHash: string) => {
    setImportedXmlHashes(prev => [...prev, xmlHash]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      customers,
      sellers,
      users,
      sales,
      categories,
      collections,
      suppliers,
      brands,
      cities,
      colors,
      sizes,
      deleteLogs,
      storeSettings,
      notificationSettings,
      securitySettings,
      importedXmlHashes,
      addProduct,
      updateProduct,
      deleteProduct,
      bulkUpdateProducts,
      addCustomer,
      addSeller,
      addUser,
      updateUser,
      deleteUser,
      resetUserPassword: operations.resetUserPassword,
      addSale,
      searchCustomers: (query) => operations.searchCustomers(customers, query),
      searchProductByBarcode: (barcode) => operations.searchProductByBarcode(products, barcode),
      searchProducts: (query) => operations.searchProducts(products, query),
      createTemporaryProduct,
      addCategory,
      addCollection,
      addSupplier,
      addBrand,
      addColor,
      addSize,
      getIncompleteProducts: () => operations.getIncompleteProducts(products),
      duplicateProduct: operations.duplicateProduct,
      isBarcodeTaken: (barcode, excludeId) => operations.isBarcodeTaken(products, barcode, excludeId),
      hasProductBeenSold: (productId) => operations.hasProductBeenSold(sales, productId),
      updateStoreSettings,
      updateNotificationSettings,
      updateSecuritySettings,
      getLowStockProducts: () => operations.getLowStockProducts(products, notificationSettings.lowStockQuantity),
      isXmlAlreadyImported,
      markXmlAsImported
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
