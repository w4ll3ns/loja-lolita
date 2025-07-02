import { Product, Customer, Seller, User, StoreSettings, NotificationSettings, SecuritySettings, RoleSettings } from '@/types/store';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Tênis Nike Air Max',
    description: 'Tênis esportivo confortável para corrida',
    price: 299.99,
    costPrice: 150.00,
    category: 'Calçados',
    collection: 'Verão 2024',
    size: '42',
    supplier: 'Nike Brasil',
    brand: 'Nike',
    quantity: 15,
    barcode: '7891234567890',
    color: 'Preto',
    gender: 'Masculino'
  },
  {
    id: '2',
    name: 'Camiseta Adidas Originals',
    description: 'Camiseta casual de algodão',
    price: 89.99,
    costPrice: 45.00,
    category: 'Roupas',
    collection: 'Básicos',
    size: 'M',
    supplier: 'Adidas Brasil',
    brand: 'Adidas',
    quantity: 25,
    barcode: '7891234567891',
    color: 'Branco',
    gender: 'Unissex'
  },
  {
    id: '3',
    name: 'Jaqueta Puma Track',
    description: 'Jaqueta esportiva para treinos',
    price: 199.99,
    costPrice: 100.00,
    category: 'Roupas',
    collection: 'Inverno 2024',
    size: 'G',
    supplier: 'Puma Brasil',
    brand: 'Puma',
    quantity: 8,
    barcode: '7891234567892',
    color: 'Azul',
    gender: 'Masculino'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    whatsapp: '11999999999',
    gender: 'M',
    city: 'São Paulo'
  },
  {
    id: '2',
    name: 'Maria Santos',
    whatsapp: '11888888888',
    gender: 'F',
    city: 'Rio de Janeiro'
  },
  {
    id: '3',
    name: 'Cliente Genérico',
    whatsapp: '',
    gender: 'Outro',
    isGeneric: true
  }
];

export const initialSellers: Seller[] = [
  {
    id: '1',
    name: 'Carlos Vendedor',
    email: 'carlos@loja.com',
    phone: '11777777777',
    active: true
  },
  {
    id: '2',
    name: 'Ana Vendedora',
    email: 'ana@loja.com',
    phone: '11666666666',
    active: true
  }
];

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Admin',
    email: 'admin@loja.com',
    phone: '11999999999',
    role: 'admin',
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Maria Vendedora',
    email: 'vendedor@loja.com',
    phone: '11888888888',
    role: 'vendedor',
    active: true,
    createdAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: 'Pedro Caixa',
    email: 'caixa@loja.com',
    phone: '11777777777',
    role: 'caixa',
    active: true,
    createdAt: new Date('2024-01-03')
  },
  {
    id: '4',
    name: 'Ana Consultiva',
    email: 'consulta@loja.com',
    phone: '11666666666',
    role: 'consultivo',
    active: true,
    createdAt: new Date('2024-01-04')
  }
];

export const initialCategories = [
  'Calçados',
  'Roupas',
  'Acessórios',
  'Esportivos',
  'Casual',
  'Formal'
];

export const initialCollections = [
  'Verão 2024',
  'Inverno 2024',
  'Básicos',
  'Premium',
  'Outlet'
];

export const initialSuppliers = [
  'Nike Brasil',
  'Adidas Brasil',
  'Puma Brasil',
  'Mizuno',
  'Olympikus',
  'Fornecedor Local'
];

export const initialBrands = [
  'Nike',
  'Adidas',
  'Puma',
  'Mizuno',
  'Olympikus',
  'Marca Própria'
];

export const initialCities = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Salvador',
  'Brasília',
  'Fortaleza',
  'Recife',
  'Porto Alegre',
  'Curitiba',
  'Goiânia'
];

export const initialColors = [
  'Preto',
  'Branco',
  'Azul',
  'Vermelho',
  'Verde',
  'Amarelo',
  'Rosa',
  'Roxo',
  'Cinza',
  'Marrom'
];

export const initialSizes = [
  'PP',
  'P',
  'M',
  'G',
  'GG',
  'XGG',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46'
];

export const initialStoreSettings: StoreSettings = {
  name: 'Minha Loja',
  address: 'Rua das Flores, 123 - Centro',
  phone: '(11) 3333-4444',
  email: 'contato@minhaloja.com',
  instagram: '@minhaloja',
  facebook: 'MinhaLojaOficial',
  hours: 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 17h'
};

export const initialNotificationSettings: NotificationSettings = {
  lowStockAlert: true,
  lowStockQuantity: 5,
  thankYouMessage: true,
  birthdayMessage: false,
  whatsappNotifications: true,
  emailNotifications: false,
  alertFrequency: 'daily',
  alertTime: '09:00'
};

export const initialSecuritySettings: SecuritySettings = {
  minPasswordLength: 6,
  passwordExpiration: 90,
  requireSpecialChars: false,
  requireNumbers: true,
  twoFactorAuth: false,
  sessionTimeout: 480,
  multipleLogins: true,
  maxSessions: 3
};

export const initialRoleSettings: RoleSettings = {
  admin: {
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewProducts: true,
    canCreateCustomers: true,
    canEditCustomers: true,
    canDeleteCustomers: true,
    canViewCustomers: true,
    canCreateSales: true,
    canEditSales: true,
    canDeleteSales: true,
    canViewSales: true,
    canViewReports: true,
    canManageUsers: true,
    canManageSettings: true,
    canImportProducts: true,
    canExportData: true
  },
  vendedor: {
    canCreateProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canViewProducts: true,
    canCreateCustomers: true,
    canEditCustomers: true,
    canDeleteCustomers: false,
    canViewCustomers: true,
    canCreateSales: true,
    canEditSales: true,
    canDeleteSales: false,
    canViewSales: true,
    canViewReports: false,
    canManageUsers: false,
    canManageSettings: false,
    canImportProducts: true,
    canExportData: false
  },
  caixa: {
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewProducts: true,
    canCreateCustomers: true,
    canEditCustomers: false,
    canDeleteCustomers: false,
    canViewCustomers: true,
    canCreateSales: true,
    canEditSales: false,
    canDeleteSales: false,
    canViewSales: true,
    canViewReports: false,
    canManageUsers: false,
    canManageSettings: false,
    canImportProducts: false,
    canExportData: false
  },
  consultivo: {
    canCreateProducts: false,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewProducts: true,
    canCreateCustomers: false,
    canEditCustomers: false,
    canDeleteCustomers: false,
    canViewCustomers: true,
    canCreateSales: false,
    canEditSales: false,
    canDeleteSales: false,
    canViewSales: true,
    canViewReports: true,
    canManageUsers: false,
    canManageSettings: false,
    canImportProducts: false,
    canExportData: true
  }
};
