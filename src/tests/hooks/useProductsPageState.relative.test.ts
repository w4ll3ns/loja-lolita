import { renderHook, act } from '@testing-library/react';
import { useProductsPageState } from '../../hooks/useProductsPageState';

describe('useProductsPageState - Relative Path', () => {
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
});

