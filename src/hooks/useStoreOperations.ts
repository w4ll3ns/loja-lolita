
import { useState } from 'react';
import { Product, Customer, Seller, User, Sale, DeleteLog } from '@/types/store';

export const useStoreOperations = () => {
  // Function to generate truly unique IDs
  const generateUniqueId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const createTemporaryProduct = (barcode: string, price: number = 0): Product => {
    return {
      id: generateUniqueId(),
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

  const duplicateProduct = (product: Product): Omit<Product, 'id'> => {
    return {
      name: `${product.name} (Cópia)`,
      description: product.description,
      price: product.price,
      costPrice: product.costPrice,
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

  const searchCustomers = (customers: Customer[], query: string): Customer[] => {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const cleanSearchTerm = query.replace(/\D/g, '');
    
    return customers.filter(customer => {
      if (customer.isGeneric) return false;
      
      const nameMatch = customer.name.toLowerCase().includes(searchTerm);
      const whatsappMatch = customer.whatsapp.replace(/\D/g, '').includes(cleanSearchTerm);
      
      return nameMatch || (cleanSearchTerm.length > 0 && whatsappMatch);
    });
  };

  const searchProducts = (products: Product[], query: string): Product[] => {
    return products.filter(product =>
      product.barcode.toLowerCase().includes(query.toLowerCase()) ||
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchProductByBarcode = (products: Product[], barcode: string): Product | null => {
    return products.find(product => product.barcode === barcode) || null;
  };

  const isBarcodeTaken = (products: Product[], barcode: string, excludeId?: string): boolean => {
    return products.some(product => 
      product.barcode === barcode && product.id !== excludeId
    );
  };

  const getIncompleteProducts = (products: Product[]): Product[] => {
    return products.filter(product => product.category === 'Temporário');
  };

  const hasProductBeenSold = (sales: Sale[], productId: string): boolean => {
    return sales.some(sale => 
      sale.items.some(item => item.product.id === productId)
    );
  };

  const getLowStockProducts = (products: Product[], lowStockQuantity: number): Product[] => {
    return products.filter(product => 
      product.quantity <= lowStockQuantity && 
      product.category !== 'Temporário'
    );
  };

  const resetUserPassword = (id: string): string => {
    const tempPassword = Math.random().toString(36).slice(-8);
    return tempPassword;
  };

  return {
    generateUniqueId,
    createTemporaryProduct,
    duplicateProduct,
    searchCustomers,
    searchProducts,
    searchProductByBarcode,
    isBarcodeTaken,
    getIncompleteProducts,
    hasProductBeenSold,
    getLowStockProducts,
    resetUserPassword
  };
};
