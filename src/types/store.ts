
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
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

export interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  hours: string;
  logo?: string;
}

export interface NotificationSettings {
  lowStockAlert: boolean;
  lowStockQuantity: number;
  thankYouMessage: boolean;
  birthdayMessage: boolean;
  whatsappNotifications: boolean;
  emailNotifications: boolean;
  alertFrequency: 'realtime' | 'daily' | 'weekly';
  alertTime: string;
}

export interface SecuritySettings {
  minPasswordLength: number;
  passwordExpiration: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  multipleLogins: boolean;
  maxSessions: number;
}
