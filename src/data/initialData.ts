
import { Product, Customer, Seller, User, StoreSettings, NotificationSettings, SecuritySettings } from '@/types/store';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Básica',
    description: 'Camiseta 100% algodão',
    price: 49.90,
    costPrice: 25.00,
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
    costPrice: 70.00,
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

export const initialCustomers: Customer[] = [
  {
    id: 'generic',
    name: 'Cliente Padrão',
    whatsapp: '(00) 00000-0000',
    gender: 'Outro',
    isGeneric: true
  }
];

export const initialSellers: Seller[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@loja.com', phone: '(11) 99999-1234', active: true },
  { id: '2', name: 'João Santos', email: 'joao@loja.com', phone: '(11) 99999-5678', active: true },
  { id: '3', name: 'Ana Costa', email: 'ana@loja.com', phone: '(11) 99999-9012', active: true }
];

export const initialUsers: User[] = [
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

export const initialStoreSettings: StoreSettings = {
  name: 'Minha Loja',
  address: '',
  phone: '',
  email: '',
  instagram: '',
  facebook: '',
  hours: ''
};

export const initialNotificationSettings: NotificationSettings = {
  lowStockAlert: true,
  lowStockQuantity: 5,
  thankYouMessage: false,
  birthdayMessage: false,
  whatsappNotifications: true,
  emailNotifications: false,
  alertFrequency: 'daily',
  alertTime: '09:00'
};

export const initialSecuritySettings: SecuritySettings = {
  minPasswordLength: 8,
  passwordExpiration: 90,
  requireSpecialChars: true,
  requireNumbers: true,
  twoFactorAuth: false,
  sessionTimeout: 480,
  multipleLogins: false,
  maxSessions: 1
};

export const initialCategories = ['Camisetas', 'Calças', 'Vestidos', 'Sapatos'];
export const initialCollections = ['Verão 2024', 'Inverno 2024', 'Primavera 2024'];
export const initialSuppliers = ['Fornecedor A', 'Fornecedor B', 'Fornecedor C'];
export const initialBrands = ['Marca X', 'Marca Y', 'Marca Z'];
export const initialCities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza'];
export const initialColors = ['Branco', 'Preto', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Cinza', 'Marrom', 'Roxo'];
export const initialSizes = ['PP', 'P', 'M', 'G', 'GG', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52'];
