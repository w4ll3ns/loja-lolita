import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number; // New field for cost price
  category: string;
  collection: string;
  size: string;
  supplier: string;
  brand: string;
  quantity: number;
  image?: string;
  barcode: string;
  color: string;
  gender: 'Masculino' | 'Feminino' | 'Unissex';
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  gender: 'M' | 'F' | 'Outro';
  city?: string;
  wantedToRegister?: boolean;
  isGeneric?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'vendedor' | 'caixa' | 'consultivo';
  active: boolean;
  createdAt: Date;
}

export interface SaleItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customer: Customer;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'value';
  total: number;
  paymentMethod: 'pix' | 'debito' | 'credito';
  seller: string;
  cashier: string;
  date: Date;
}

export interface DeleteLog {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  date: Date;
  reason?: string;
  requiredPassword: boolean;
}

interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  hours: string;
  logo?: string;
}

interface NotificationSettings {
  lowStockAlert: boolean;
  lowStockQuantity: number;
  thankYouMessage: boolean;
  birthdayMessage: boolean;
  whatsappNotifications: boolean;
  emailNotifications: boolean;
  alertFrequency: 'realtime' | 'daily' | 'weekly';
  alertTime: string;
}

interface SecuritySettings {
  minPasswordLength: number;
  passwordExpiration: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  multipleLogins: boolean;
  maxSessions: number;
}

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
  deleteLogs: DeleteLog[];
  storeSettings: StoreSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
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
  getIncompleteProducts: () => Product[];
  duplicateProduct: (product: Product) => Omit<Product, 'id'>;
  isBarcodeTaken: (barcode: string, excludeId?: string) => boolean;
  hasProductBeenSold: (productId: string) => boolean;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  getLowStockProducts: () => Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Updated initial products with cost price
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Básica',
    description: 'Camiseta 100% algodão',
    price: 49.90,
    costPrice: 25.00, // New field
    category: 'Camisetas',
    collection: 'Verão 2024',
    size: 'M',
    supplier: 'Fornecedor A',
    brand: 'Marca X',
    quantity: 50,
    barcode: '7891234567890',
    color: 'Branco',
    gender: 'Unissex'
  },
  {
    id: '2',
    name: 'Calça Jeans',
    description: 'Calça jeans slim fit',
    price: 129.90,
    costPrice: 70.00, // New field
    category: 'Calças',
    collection: 'Inverno 2024',
    size: '42',
    supplier: 'Fornecedor B',
    brand: 'Marca Y',
    quantity: 25,
    barcode: '7891234567891',
    color: 'Azul',
    gender: 'Feminino'
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'generic',
    name: 'Cliente Padrão',
    whatsapp: '(00) 00000-0000',
    gender: 'Outro',
    isGeneric: true
  }
];

const initialSellers: Seller[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@loja.com', phone: '(11) 99999-1234', active: true },
  { id: '2', name: 'João Santos', email: 'joao@loja.com', phone: '(11) 99999-5678', active: true },
  { id: '3', name: 'Ana Costa', email: 'ana@loja.com', phone: '(11) 99999-9012', active: true }
];

const initialUsers: User[] = [
  { 
    id: '1', 
    name: 'Admin Master', 
    email: 'admin@loja.com', 
    phone: '(11) 99999-0000',
    role: 'admin', 
    active: true,
    createdAt: new Date('2024-01-01')
  },
  { 
    id: '2', 
    name: 'João Vendedor', 
    email: 'joao@loja.com', 
    phone: '(11) 99999-1111',
    role: 'vendedor', 
    active: true,
    createdAt: new Date('2024-01-15')
  },
  { 
    id: '3', 
    name: 'Maria Caixa', 
    email: 'maria@loja.com', 
    phone: '(11) 99999-2222',
    role: 'caixa', 
    active: false,
    createdAt: new Date('2024-02-01')
  },
];

const initialStoreSettings: StoreSettings = {
  name: 'Minha Loja',
  address: '',
  phone: '',
  email: '',
  instagram: '',
  facebook: '',
  hours: ''
};

const initialNotificationSettings: NotificationSettings = {
  lowStockAlert: true,
  lowStockQuantity: 5,
  thankYouMessage: false,
  birthdayMessage: false,
  whatsappNotifications: true,
  emailNotifications: false,
  alertFrequency: 'daily',
  alertTime: '09:00'
};

const initialSecuritySettings: SecuritySettings = {
  minPasswordLength: 8,
  passwordExpiration: 90,
  requireSpecialChars: true,
  requireNumbers: true,
  twoFactorAuth: false,
  sessionTimeout: 480,
  multipleLogins: false,
  maxSessions: 1
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<string[]>(['Camisetas', 'Calças', 'Vestidos', 'Sapatos']);
  const [collections, setCollections] = useState<string[]>(['Verão 2024', 'Inverno 2024', 'Primavera 2024']);
  const [suppliers, setSuppliers] = useState<string[]>(['Fornecedor A', 'Fornecedor B', 'Fornecedor C']);
  const [brands, setBrands] = useState<string[]>(['Marca X', 'Marca Y', 'Marca Z']);
  const [cities, setCities] = useState<string[]>(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza']);
  const [colors, setColors] = useState<string[]>(['Branco', 'Preto', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Cinza', 'Marrom', 'Roxo']);
  const [deleteLogs, setDeleteLogs] = useState<DeleteLog[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(initialStoreSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);

  // Function to generate truly unique IDs
  const generateUniqueId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: generateUniqueId() };
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

  const hasProductBeenSold = (productId: string): boolean => {
    return sales.some(sale => 
      sale.items.some(item => item.product.id === productId)
    );
  };

  const deleteProduct = (id: string, userId: string, userName: string, reason?: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const requiresPassword = hasProductBeenSold(id);
    
    // Log the deletion
    const deleteLog: DeleteLog = {
      id: generateUniqueId(),
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

  const isBarcodeTaken = (barcode: string, excludeId?: string): boolean => {
    return products.some(product => 
      product.barcode === barcode && product.id !== excludeId
    );
  };

  // User management functions
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = { 
      ...user, 
      id: generateUniqueId(),
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

  const resetUserPassword = (id: string): string => {
    const tempPassword = Math.random().toString(36).slice(-8);
    console.log(`Senha temporária gerada para usuário ${id}:`, tempPassword);
    return tempPassword;
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: generateUniqueId() };
    setCustomers(prev => [...prev, newCustomer]);
    
    // Adicionar cidade se não existir
    if (customer.city && !cities.includes(customer.city)) {
      setCities(prev => [...prev, customer.city!]);
    }
  };

  const addSeller = (seller: Omit<Seller, 'id'>) => {
    const newSeller = { ...seller, id: generateUniqueId() };
    setSellers(prev => [...prev, newSeller]);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale = { ...sale, id: generateUniqueId(), date: new Date() };
    setSales(prev => [newSale, ...prev]);
    
    // Reduzir estoque e criar produtos temporários se necessário
    sale.items.forEach(item => {
      if (item.product.category === 'Temporário' && item.product.quantity === 1) {
        // Produto temporário criado durante a venda, não reduzir estoque
        // Mas marcar como vendido pelo menos uma vez
        updateProduct(item.product.id, { 
          description: `Produto criado em venda - ${newSale.date.toLocaleDateString()} - Necessita edição completa`
        });
      } else {
        // Produto normal, reduzir estoque
        updateProduct(item.product.id, { 
          quantity: Math.max(0, item.product.quantity - item.quantity)
        });
      }
    });
  };

  const searchCustomers = (query: string): Customer[] => {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const cleanSearchTerm = query.replace(/\D/g, ''); // Remove caracteres não numéricos para buscar WhatsApp
    
    return customers.filter(customer => {
      if (customer.isGeneric) return false;
      
      const nameMatch = customer.name.toLowerCase().includes(searchTerm);
      const whatsappMatch = customer.whatsapp.replace(/\D/g, '').includes(cleanSearchTerm);
      
      return nameMatch || (cleanSearchTerm.length > 0 && whatsappMatch);
    });
  };

  const searchProductByBarcode = (barcode: string): Product | null => {
    return products.find(product => product.barcode === barcode) || null;
  };

  const searchProducts = (query: string): Product[] => {
    return products.filter(product =>
      product.barcode.toLowerCase().includes(query.toLowerCase()) ||
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const createTemporaryProduct = (barcode: string, price: number = 0): Product => {
    const temporaryProduct: Product = {
      id: generateUniqueId(),
      name: `🔧 Produto não cadastrado`,
      description: 'Produto temporário criado durante a venda. Necessita edição completa dos dados.',
      price: price,
      costPrice: 0, // New field for temporary products
      category: 'Temporário',
      collection: 'Temporário',
      size: 'N/A',
      supplier: 'A definir',
      brand: 'A definir',
      quantity: 1,
      barcode: barcode,
      color: 'A definir',
      gender: 'Unissex'
    };
    
    setProducts(prev => [...prev, temporaryProduct]);
    
    if (!categories.includes('Temporário')) {
      setCategories(prev => [...prev, 'Temporário']);
    }
    
    return temporaryProduct;
  };

  const getIncompleteProducts = (): Product[] => {
    return products.filter(product => product.category === 'Temporário');
  };

  const duplicateProduct = (product: Product): Omit<Product, 'id'> => {
    return {
      name: `${product.name} (Cópia)`,
      description: product.description,
      price: product.price,
      costPrice: product.costPrice, // Include cost price in duplication
      category: product.category,
      collection: product.collection,
      size: product.size,
      supplier: product.supplier,
      brand: product.brand,
      quantity: product.quantity,
      barcode: '',
      color: product.color,
      gender: product.gender,
      image: product.image
    };
  };

  const addColor = (color: string) => {
    if (!colors.includes(color)) {
      setColors(prev => [...prev, color]);
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

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => 
      product.quantity <= notificationSettings.lowStockQuantity && 
      product.category !== 'Temporário'
    );
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
      deleteLogs,
      storeSettings,
      notificationSettings,
      securitySettings,
      addProduct,
      updateProduct,
      deleteProduct,
      bulkUpdateProducts,
      addCustomer,
      addSeller,
      addUser,
      updateUser,
      deleteUser,
      resetUserPassword,
      addSale,
      searchCustomers,
      searchProductByBarcode,
      searchProducts,
      createTemporaryProduct,
      addCategory,
      addCollection,
      addSupplier,
      addBrand,
      addColor,
      getIncompleteProducts,
      duplicateProduct,
      isBarcodeTaken,
      hasProductBeenSold,
      updateStoreSettings,
      updateNotificationSettings,
      updateSecuritySettings,
      getLowStockProducts
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
