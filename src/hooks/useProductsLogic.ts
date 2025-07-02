
import { Product } from '@/types/store';

export const useProductsLogic = (
  products: Product[],
  setProducts: (fn: (prev: Product[]) => Product[]) => void,
  categories: string[],
  setCategories: (fn: (prev: string[]) => string[]) => void,
  collections: string[],
  setCollections: (fn: (prev: string[]) => string[]) => void,
  suppliers: string[],
  setSuppliers: (fn: (prev: string[]) => string[]) => void,
  brands: string[],
  setBrands: (fn: (prev: string[]) => string[]) => void,
  colors: string[],
  setColors: (fn: (prev: string[]) => string[]) => void,
  sizes: string[],
  setSizes: (fn: (prev: string[]) => string[]) => void,
  operations: any
) => {
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const result = await operations.addProduct(product);
    if (result) {
      // Reload products from database
      await operations.loadProducts?.();
      
      // Add new categories/collections/etc if they don't exist
      if (!categories.includes(product.category)) {
        setCategories(prev => [...prev, product.category]);
      }
      if (!collections.includes(product.collection)) {
        setCollections(prev => [...prev, product.collection]);
      }
      if (!suppliers.includes(product.supplier)) {
        setSuppliers(prev => [...prev, product.supplier]);
      }
      if (!brands.includes(product.brand)) {
        setBrands(prev => [...prev, product.brand]);
      }
      if (!colors.includes(product.color)) {
        setColors(prev => [...prev, product.color]);
      }
      if (!sizes.includes(product.size)) {
        setSizes(prev => [...prev, product.size]);
      }
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const success = await operations.updateProduct(id, updates);
    if (success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const deleteProduct = async (id: string, reason?: string, requirePassword?: boolean) => {
    const success = await operations.deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const bulkEditProducts = async (ids: string[], updates: Partial<Product>) => {
    for (const id of ids) {
      await updateProduct(id, updates);
    }
  };

  const importProducts = async (productsToImport: Omit<Product, 'id'>[]) => {
    for (const product of productsToImport) {
      await addProduct(product);
    }
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    bulkEditProducts,
    importProducts
  };
};
