
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

  // Update operations
  const updateCategory = async (oldName: string, newName: string) => {
    const success = await operations.updateDropdownItem('categories', oldName, newName);
    if (success) {
      setters.setCategories(prev => prev.map(item => item === oldName ? newName : item));
    }
  };

  const updateCollection = async (oldName: string, newName: string) => {
    const success = await operations.updateDropdownItem('collections', oldName, newName);
    if (success) {
      setters.setCollections(prev => prev.map(item => item === oldName ? newName : item));
    }
  };

  const updateSupplier = async (oldName: string, newName: string) => {
    const success = await operations.updateDropdownItem('suppliers', oldName, newName);
    if (success) {
      setters.setSuppliers(prev => prev.map(item => item === oldName ? newName : item));
    }
  };

  const updateBrand = async (oldName: string, newName: string) => {
    const success = await operations.updateDropdownItem('brands', oldName, newName);
    if (success) {
      setters.setBrands(prev => prev.map(item => item === oldName ? newName : item));
    }
  };

  const updateColor = async (oldName: string, newName: string) => {
    const success = await operations.updateDropdownItem('colors', oldName, newName);
    if (success) {
      setters.setColors(prev => prev.map(item => item === oldName ? newName : item));
    }
  };

  const updateSize = async (oldName: string, newName: string) => {
    const success = await operations.updateDropdownItem('sizes', oldName, newName);
    if (success) {
      setters.setSizes(prev => prev.map(item => item === oldName ? newName : item));
    }
  };

  // Delete operations
  const deleteCategory = async (name: string) => {
    const success = await operations.deleteDropdownItem('categories', name);
    if (success) {
      setters.setCategories(prev => prev.filter(item => item !== name));
    }
  };

  const deleteCollection = async (name: string) => {
    const success = await operations.deleteDropdownItem('collections', name);
    if (success) {
      setters.setCollections(prev => prev.filter(item => item !== name));
    }
  };

  const deleteSupplier = async (name: string) => {
    const success = await operations.deleteDropdownItem('suppliers', name);
    if (success) {
      setters.setSuppliers(prev => prev.filter(item => item !== name));
    }
  };

  const deleteBrand = async (name: string) => {
    const success = await operations.deleteDropdownItem('brands', name);
    if (success) {
      setters.setBrands(prev => prev.filter(item => item !== name));
    }
  };

  const deleteColor = async (name: string) => {
    const success = await operations.deleteDropdownItem('colors', name);
    if (success) {
      setters.setColors(prev => prev.filter(item => item !== name));
    }
  };

  const deleteSize = async (name: string) => {
    const success = await operations.deleteDropdownItem('sizes', name);
    if (success) {
      setters.setSizes(prev => prev.filter(item => item !== name));
    }
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
