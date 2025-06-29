
import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  collection: string;
  size: string;
  supplier: string;
  brand: string;
  quantity: number;
  image?: string;
  barcode: string;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  gender: 'M' | 'F' | 'Outro';
  city?: string;
  isGeneric?: boolean;
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
  total: number;
  paymentMethod: 'pix' | 'debito' | 'credito';
  seller: string;
  cashier: string;
  date: Date;
}

interface StoreContextType {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  searchCustomers: (query: string) => Customer[];
  updateStock: (productId: string, quantity: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Dados de exemplo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Básica',
    description: 'Camiseta 100% algodão',
    price: 49.99,
    category: 'Camisetas',
    collection: 'Verão 2024',
    size: 'M',
    supplier: 'Fornecedor A',
    brand: 'Marca X',
    quantity: 15,
    barcode: '1234567890123'
  },
  {
    id: '2',
    name: 'Calça Jeans',
    description: 'Calça jeans slim fit',
    price: 129.99,
    category: 'Calças',
    collection: 'Inverno 2024',
    size: '42',
    supplier: 'Fornecedor B',
    brand: 'Marca Y',
    quantity: 8,
    barcode: '1234567890124'
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Cliente Padrão',
    whatsapp: '00000000000',
    gender: 'Outro',
    isGeneric: true
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [sales, setSales] = useState<Sale[]>([]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale = { ...sale, id: Date.now().toString(), date: new Date() };
    setSales(prev => [...prev, newSale]);
    
    // Atualizar estoque
    sale.items.forEach(item => {
      updateStock(item.product.id, -item.quantity);
    });
  };

  const searchCustomers = (query: string): Customer[] => {
    if (!query.trim()) return [];
    
    return customers.filter(customer => 
      !customer.isGeneric && (
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.whatsapp.includes(query)
      )
    );
  };

  const updateStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, quantity: Math.max(0, p.quantity + quantity) }
        : p
    ));
  };

  return (
    <StoreContext.Provider value={{
      products,
      customers,
      sales,
      addProduct,
      updateProduct,
      addCustomer,
      addSale,
      searchCustomers,
      updateStock
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
