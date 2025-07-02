
import { Product, DeleteLog } from '@/types/store';

export const useProductsLogic = (
  products: Product[],
  setProducts: (fn: (prev: Product[]) => Product[]) => void,
  deleteLogs: DeleteLog[],
  setDeleteLogs: (fn: (prev: DeleteLog[]) => DeleteLog[]) => void,
  sales: any[],
  operations: any,
  categories: string[],
  setCategories: (fn: (prev: string[]) => string[]) => void
) => {
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: operations.generateUniqueId() };
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

  const deleteProduct = (id: string, userId: string, userName: string, reason?: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const requiresPassword = operations.hasProductBeenSold(sales, id);
    
    const deleteLog: DeleteLog = {
      id: operations.generateUniqueId(),
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

  const createTemporaryProduct = (barcode: string, price: number = 0): Product => {
    const temporaryProduct = operations.createTemporaryProduct(barcode, price);
    setProducts(prev => [...prev, temporaryProduct]);
    
    if (!categories.includes('Temporário')) {
      setCategories(prev => [...prev, 'Temporário']);
    }
    
    return temporaryProduct;
  };

  return {
    addProduct,
    updateProduct,
    bulkUpdateProducts,
    deleteProduct,
    createTemporaryProduct,
    searchProducts: (query: string) => operations.searchProducts(products, query),
    searchProductByBarcode: (barcode: string) => operations.searchProductByBarcode(products, barcode),
    getIncompleteProducts: () => operations.getIncompleteProducts(products),
    duplicateProduct: operations.duplicateProduct,
    isBarcodeTaken: (barcode: string, excludeId?: string) => operations.isBarcodeTaken(products, barcode, excludeId),
    hasProductBeenSold: (productId: string) => operations.hasProductBeenSold(sales, productId),
    getLowStockProducts: () => operations.getLowStockProducts(products, 5)
  };
};
