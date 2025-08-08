import { useMemo } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { useDataManagement } from '../contexts/DataManagementContext';
import { useAuth } from '../contexts/AuthContext';

export const useProductsPageComputed = (searchTerm: string) => {
  const { products } = useProducts();
  const { 
    categories, 
    collections, 
    suppliers, 
    brands, 
    colors, 
    sizes 
  } = useDataManagement();
  const { user } = useAuth();

  // Filtered products based on search term
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm)
    );
  }, [products, searchTerm]);

  // Calculate stock totals
  const stockTotals = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (product.quantity > 0) {
        acc.totalCost += product.costPrice * product.quantity;
        acc.totalSaleValue += product.price * product.quantity;
      }
      return acc;
    }, { totalCost: 0, totalSaleValue: 0 });
  }, [filteredProducts]);

  // Available genders
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  // Permissions
  const canEdit = user?.role === 'admin' || user?.role === 'caixa';
  const canAddStructuralData = user?.role === 'admin';

  return {
    filteredProducts,
    stockTotals,
    categories,
    collections,
    suppliers,
    brands,
    colors,
    sizes,
    genders,
    canEdit,
    canAddStructuralData,
  };
};
