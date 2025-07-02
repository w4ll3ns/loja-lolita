
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
  low_stock_alert: boolean;
  low_stock_quantity: number;
  thank_you_message: boolean;
  birthday_message: boolean;
  whatsapp_notifications: boolean;
  email_notifications: boolean;
  alert_frequency: 'realtime' | 'daily' | 'weekly';
  alert_time: string;
}

export interface SecuritySettings {
  min_password_length: number;
  password_expiration: number;
  require_special_chars: boolean;
  require_numbers: boolean;
  two_factor_auth: boolean;
  session_timeout: number;
  multiple_logins: boolean;
  max_sessions: number;
}

export interface RolePermissions {
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canViewProducts: boolean;
  canCreateCustomers: boolean;
  canEditCustomers: boolean;
  canDeleteCustomers: boolean;
  canViewCustomers: boolean;
  canCreateSales: boolean;
  canEditSales: boolean;
  canDeleteSales: boolean;
  canViewSales: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canImportProducts: boolean;
  canExportData: boolean;
}

export interface RoleSettings {
  admin: RolePermissions;
  vendedor: RolePermissions;
  caixa: RolePermissions;
  consultivo: RolePermissions;
}
