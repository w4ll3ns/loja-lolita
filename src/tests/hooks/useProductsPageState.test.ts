import { renderHook, act } from '@testing-library/react';
import { useProductsPageState } from '../../hooks/useProductsPageState';

describe('useProductsPageState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProductsPageState());

    expect(result.current.searchTerm).toBe('');
    expect(result.current.viewMode).toBe('cards');
    expect(result.current.isAddDialogOpen).toBe(false);
    expect(result.current.isEditDialogOpen).toBe(false);
    expect(result.current.selectedProducts).toEqual([]);
    expect(result.current.editingProduct).toBeNull();
    expect(result.current.productToDelete).toBeNull();
  });

  it('should update search term', () => {
    const { result } = renderHook(() => useProductsPageState());

    act(() => {
      result.current.setSearchTerm('test product');
    });

    expect(result.current.searchTerm).toBe('test product');
  });

  it('should update view mode', () => {
    const { result } = renderHook(() => useProductsPageState());

    act(() => {
      result.current.setViewMode('list');
    });

    expect(result.current.viewMode).toBe('list');
  });

  it('should toggle add dialog', () => {
    const { result } = renderHook(() => useProductsPageState());

    act(() => {
      result.current.setIsAddDialogOpen(true);
    });

    expect(result.current.isAddDialogOpen).toBe(true);

    act(() => {
      result.current.setIsAddDialogOpen(false);
    });

    expect(result.current.isAddDialogOpen).toBe(false);
  });

  it('should update selected products', () => {
    const { result } = renderHook(() => useProductsPageState());

    act(() => {
      result.current.setSelectedProducts(['product1', 'product2']);
    });

    expect(result.current.selectedProducts).toEqual(['product1', 'product2']);
  });

  it('should update editing product', () => {
    const { result } = renderHook(() => useProductsPageState());

    const mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 100,
      costPrice: 50,
      quantity: 10,
      category: 'Test',
      collection: 'Test',
      size: 'M',
      supplier: 'Test',
      brand: 'Test',
      barcode: '123456',
      color: 'Blue',
      gender: 'Unissex' as const,
      description: 'Test description'
    };

    act(() => {
      result.current.setEditingProduct(mockProduct);
    });

    expect(result.current.editingProduct).toEqual(mockProduct);
  });

  it('should update new product form', () => {
    const { result } = renderHook(() => useProductsPageState());

    const newProductData = {
      name: 'New Product',
      description: 'New description',
      price: '150',
      costPrice: '75',
      category: 'New Category',
      collection: 'New Collection',
      size: 'L',
      supplier: 'New Supplier',
      brand: 'New Brand',
      quantity: '20',
      barcode: '654321',
      color: 'Red',
      gender: 'Masculino' as const
    };

    act(() => {
      result.current.setNewProduct(newProductData);
    });

    expect(result.current.newProduct).toEqual(newProductData);
  });

  it('should update quick add modal states', () => {
    const { result } = renderHook(() => useProductsPageState());

    act(() => {
      result.current.setIsAddCategoryOpen(true);
      result.current.setIsAddBrandOpen(true);
    });

    expect(result.current.isAddCategoryOpen).toBe(true);
    expect(result.current.isAddBrandOpen).toBe(true);
    expect(result.current.isAddCollectionOpen).toBe(false);
  });

  it('should update new item names', () => {
    const { result } = renderHook(() => useProductsPageState());

    act(() => {
      result.current.setNewCategoryName('New Category');
      result.current.setNewBrandName('New Brand');
    });

    expect(result.current.newCategoryName).toBe('New Category');
    expect(result.current.newBrandName).toBe('New Brand');
  });
});
