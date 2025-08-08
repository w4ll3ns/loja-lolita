import { renderHook } from '@testing-library/react';
import { useProductsPageComputed } from '../../hooks/useProductsPageComputed';

// Mock simples dos contextos
jest.mock('../../contexts/ProductsContext', () => ({
  useProducts: () => ({
    products: [
      {
        id: '1',
        name: 'Product 1',
        price: 100,
        costPrice: 50,
        quantity: 10,
        category: 'Category 1',
        collection: 'Collection 1',
        size: 'M',
        supplier: 'Supplier 1',
        brand: 'Brand 1',
        barcode: '123456',
        color: 'Blue',
        gender: 'Unissex' as const,
        description: 'Description 1'
      },
      {
        id: '2',
        name: 'Product 2',
        price: 200,
        costPrice: 100,
        quantity: 5,
        category: 'Category 2',
        collection: 'Collection 2',
        size: 'L',
        supplier: 'Supplier 2',
        brand: 'Brand 2',
        barcode: '654321',
        color: 'Red',
        gender: 'Masculino' as const,
        description: 'Description 2'
      }
    ]
  })
}));

jest.mock('../../contexts/DataManagementContext', () => ({
  useDataManagement: () => ({
    categories: ['Category 1', 'Category 2', 'Category 3'],
    collections: ['Collection 1', 'Collection 2'],
    suppliers: ['Supplier 1', 'Supplier 2'],
    brands: ['Brand 1', 'Brand 2'],
    colors: ['Blue', 'Red', 'Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    cities: []
  })
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'admin@test.com', role: 'admin', name: 'Admin User' },
    session: null,
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
    isAuthenticated: true
  })
}));

describe('useProductsPageComputed - Simple', () => {
  it('should filter products based on search term', () => {
    const { result } = renderHook(() => useProductsPageComputed('Product 1'));

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Product 1');
  });

  it('should filter products by category', () => {
    const { result } = renderHook(() => useProductsPageComputed('Category 1'));

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].category).toBe('Category 1');
  });

  it('should filter products by barcode', () => {
    const { result } = renderHook(() => useProductsPageComputed('123456'));

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].barcode).toBe('123456');
  });

  it('should return all products when search term is empty', () => {
    const { result } = renderHook(() => useProductsPageComputed(''));

    expect(result.current.filteredProducts).toHaveLength(2);
  });

  it('should calculate stock totals correctly', () => {
    const { result } = renderHook(() => useProductsPageComputed(''));

    // Product 1: costPrice=50 * quantity=10 = 500, price=100 * quantity=10 = 1000
    // Product 2: costPrice=100 * quantity=5 = 500, price=200 * quantity=5 = 1000
    // Total: costPrice=1000, price=2000
    expect(result.current.stockTotals.totalCost).toBe(1000);
    expect(result.current.stockTotals.totalSaleValue).toBe(2000);
  });

  it('should return correct categories', () => {
    const { result } = renderHook(() => useProductsPageComputed(''));

    expect(result.current.categories).toEqual(['Category 1', 'Category 2', 'Category 3']);
  });

  it('should return correct permissions for admin user', () => {
    const { result } = renderHook(() => useProductsPageComputed(''));

    expect(result.current.canEdit).toBe(true);
    expect(result.current.canAddStructuralData).toBe(true);
  });
});

