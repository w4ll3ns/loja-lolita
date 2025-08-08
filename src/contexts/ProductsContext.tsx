import React, { createContext, useContext, ReactNode } from 'react';
import { Product } from '@/types/store';
import { useProductsLogic } from '@/hooks/useProductsLogic';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';

interface ProductsContextType {
  // Data
  products: Product[];
  
  // Operations
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
  
  // Utility operations
  generateUniqueId: () => string;
  refreshData: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const supabaseStore = useSupabaseStore();
  const productsLogic = useProductsLogic();

  // Helper functions
  const duplicateProduct = (product: Product): Product => {
    return {
      ...product,
      id: productsLogic.generateUniqueId(),
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
    return {
      id: productsLogic.generateUniqueId(),
      name: `🔧 Produto não cadastrado`,
      description: 'Produto temporário criado durante a venda. Necessita edição completa dos dados.',
      price: price,
      costPrice: 0,
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
  };

  const getLowStockProducts = (): Product[] => {
    return supabaseStore.products.filter(product => 
      product.quantity <= 3 && product.category !== 'Temporário'
    );
  };

  const contextValue: ProductsContextType = {
    // Data
    products: supabaseStore.products,
    
    // Operations from logic hooks
    ...productsLogic,
    
    // Additional helper functions
    duplicateProduct,
    isBarcodeTaken,
    hasProductBeenSold,
    searchProducts,
    createTemporaryProduct,
    getLowStockProducts,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

