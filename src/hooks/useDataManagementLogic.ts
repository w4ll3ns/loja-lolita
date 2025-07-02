
export const useDataManagementLogic = (
  data: {
    categories: string[];
    collections: string[];
    suppliers: string[];
    brands: string[];
    colors: string[];
    sizes: string[];
  },
  setters: {
    setCategories: (fn: (prev: string[]) => string[]) => void;
    setCollections: (fn: (prev: string[]) => string[]) => void;
    setSuppliers: (fn: (prev: string[]) => string[]) => void;
    setBrands: (fn: (prev: string[]) => string[]) => void;
    setColors: (fn: (prev: string[]) => string[]) => void;
    setSizes: (fn: (prev: string[]) => string[]) => void;
  },
  operations: any
) => {
  const addCategory = async (name: string) => {
    const success = await operations.addDropdownItem('categories', name);
    if (success) {
      setters.setCategories(prev => [...prev, name]);
    }
  };

  const addCollection = async (name: string) => {
    const success = await operations.addDropdownItem('collections', name);
    if (success) {
      setters.setCollections(prev => [...prev, name]);
    }
  };

  const addSupplier = async (name: string) => {
    const success = await operations.addDropdownItem('suppliers', name);
    if (success) {
      setters.setSuppliers(prev => [...prev, name]);
    }
  };

  const addBrand = async (name: string) => {
    const success = await operations.addDropdownItem('brands', name);
    if (success) {
      setters.setBrands(prev => [...prev, name]);
    }
  };

  const addColor = async (name: string) => {
    const success = await operations.addDropdownItem('colors', name);
    if (success) {
      setters.setColors(prev => [...prev, name]);
    }
  };

  const addSize = async (name: string) => {
    const success = await operations.addDropdownItem('sizes', name);
    if (success) {
      setters.setSizes(prev => [...prev, name]);
    }
  };

  // Update operations (these will need Supabase implementation later)
  const updateCategory = (oldName: string, newName: string) => {
    setters.setCategories(prev => prev.map(item => item === oldName ? newName : item));
  };

  const updateCollection = (oldName: string, newName: string) => {
    setters.setCollections(prev => prev.map(item => item === oldName ? newName : item));
  };

  const updateSupplier = (oldName: string, newName: string) => {
    setters.setSuppliers(prev => prev.map(item => item === oldName ? newName : item));
  };

  const updateBrand = (oldName: string, newName: string) => {
    setters.setBrands(prev => prev.map(item => item === oldName ? newName : item));
  };

  const updateColor = (oldName: string, newName: string) => {
    setters.setColors(prev => prev.map(item => item === oldName ? newName : item));
  };

  const updateSize = (oldName: string, newName: string) => {
    setters.setSizes(prev => prev.map(item => item === oldName ? newName : item));
  };

  // Delete operations - Fixed to use name instead of index
  const deleteCategory = (name: string) => {
    setters.setCategories(prev => prev.filter(item => item !== name));
  };

  const deleteCollection = (name: string) => {
    setters.setCollections(prev => prev.filter(item => item !== name));
  };

  const deleteSupplier = (name: string) => {
    setters.setSuppliers(prev => prev.filter(item => item !== name));
  };

  const deleteBrand = (name: string) => {
    setters.setBrands(prev => prev.filter(item => item !== name));
  };

  const deleteColor = (name: string) => {
    setters.setColors(prev => prev.filter(item => item !== name));
  };

  const deleteSize = (name: string) => {
    setters.setSizes(prev => prev.filter(item => item !== name));
  };

  return {
    addCategory,
    addCollection,
    addSupplier,
    addBrand,
    addColor,
    addSize,
    updateCategory,
    updateCollection,
    updateSupplier,
    updateBrand,
    updateColor,
    updateSize,
    deleteCategory,
    deleteCollection,
    deleteSupplier,
    deleteBrand,
    deleteColor,
    deleteSize
  };
};
