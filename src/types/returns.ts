import { Customer, Product, Sale } from './store';

export type ReturnType = 'return' | 'exchange';
export type ReturnReason = 'defective' | 'wrong_size' | 'wrong_color' | 'not_liked' | 'other';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type RefundMethod = 'same_payment' | 'store_credit' | 'exchange';

export interface ReturnItem {
  id: string;
  return_id: string;
  sale_item_id: string;
  product_id: string;
  quantity: number;
  original_price: number;
  refund_price: number;
  condition_description?: string;
  created_at: string;
  // Relacionamentos
  product?: Product;
  sale_item?: any; // SaleItem do banco
}

export interface ExchangeItem {
  id: string;
  return_id: string;
  original_product_id: string;
  new_product_id: string;
  quantity: number;
  price_difference: number;
  created_at: string;
  // Relacionamentos
  original_product?: Product;
  new_product?: Product;
}

export interface Return {
  id: string;
  sale_id: string;
  customer_id: string;
  return_type: ReturnType;
  return_reason: ReturnReason;
  status: ReturnStatus;
  refund_method?: RefundMethod;
  refund_amount?: number;
  store_credit_amount: number;
  notes?: string;
  processed_by: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  sale?: Sale;
  customer?: Customer;
  return_items?: ReturnItem[];
  exchange_items?: ExchangeItem[];
}

export interface StoreCredit {
  id: string;
  customer_id: string;
  amount: number;
  balance: number;
  expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  customer?: Customer;
  transactions?: StoreCreditTransaction[];
}

export interface StoreCreditTransaction {
  id: string;
  store_credit_id: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  description: string;
  related_sale_id?: string;
  related_return_id?: string;
  created_at: string;
  // Relacionamentos
  store_credit?: StoreCredit;
  related_sale?: Sale;
  related_return?: Return;
}

// Interfaces para criação de devoluções
export interface CreateReturnData {
  sale_id: string;
  customer_id: string;
  return_type: ReturnType;
  return_reason: ReturnReason;
  refund_method?: RefundMethod;
  notes?: string;
  items: CreateReturnItemData[];
  exchange_items?: CreateExchangeItemData[];
}

export interface CreateReturnItemData {
  sale_item_id: string;
  product_id: string;
  quantity: number;
  original_price: number;
  refund_price: number;
  condition_description?: string;
}

export interface CreateExchangeItemData {
  original_product_id: string;
  new_product_id: string;
  quantity: number;
  price_difference: number;
}

// Interfaces para criação de créditos da loja
export interface CreateStoreCreditData {
  customer_id: string;
  amount: number;
  expires_at?: string;
  notes?: string;
}

// Interfaces para filtros e busca
export interface ReturnFilters {
  status?: ReturnStatus;
  return_type?: ReturnType;
  customer_id?: string;
  date_from?: string;
  date_to?: string;
}

// Interfaces para estatísticas
export interface ReturnStats {
  total_returns: number;
  total_exchanges: number;
  total_refunded: number;
  total_store_credits: number;
  returns_by_reason: Record<ReturnReason, number>;
  returns_by_status: Record<ReturnStatus, number>;
} 