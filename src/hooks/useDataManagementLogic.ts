
export const useDataManagementLogic = (state: {
  categories: string[];
  setCategories: (fn: (prev: string[]) => string[]) => void;
  collections: string[];
  setCollections: (fn: (prev: string[]) => string[]) => void;
  suppliers: string[];
  setSuppliers: (fn: (prev: string[]) => string[]) => void;
  brands: string[];
  setBrands: (fn: (prev: string[]) => string[]) => void;
  colors: string[];
  setColors: (fn: (prev: string[]) => string[]) => void;
  sizes: string[];
  setSizes: (fn: (prev: string[]) => string[]) => void;
}) => {
  const { categories, setCategories, collections, setCollections, suppliers, setSuppliers, brands, setBrands, colors, setColors, sizes, setSizes } = state;

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const updateCategory = (index: number, newCategory: string) => {
    setCategories(prev => prev.map((category, i) => i === index ? newCategory : category));
  };

  const removeCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const addCollection = (collection: string) => {
    if (!collections.includes(collection)) {
      setCollections(prev => [...prev, collection]);
    }
  };

  const updateCollection = (index: number, newCollection: string) => {
    setCollections(prev => prev.map((collection, i) => i === index ? newCollection : collection));
  };

  const removeCollection = (index: number) => {
    setCollections(prev => prev.filter((_, i) => i !== index));
  };

  const addSupplier = (supplier: string) => {
    if (!suppliers.includes(supplier)) {
      setSuppliers(prev => [...prev, supplier]);
    }
  };

  const updateSupplier = (index: number, newSupplier: string) => {
    setSuppliers(prev => prev.map((supplier, i) => i === index ? newSupplier : supplier));
  };

  const removeSupplier = (index: number) => {
    setSuppliers(prev => prev.filter((_, i) => i !== index));
  };

  const addBrand = (brand: string) => {
    if (!brands.includes(brand)) {
      setBrands(prev => [...prev, brand]);
    }
  };

  const updateBrand = (index: number, newBrand: string) => {
    setBrands(prev => prev.map((brand, i) => i === index ? newBrand : brand));
  };

  const removeBrand = (index: number) => {
    setBrands(prev => prev.filter((_, i) => i !== index));
  };

  const addColor = (color: string) => {
    if (!colors.includes(color)) {
      setColors(prev => [...prev, color]);
    }
  };

  const updateColor = (index: number, newColor: string) => {
    setColors(prev => prev.map((color, i) => i === index ? newColor : color));
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = (size: string) => {
    if (!sizes.includes(size)) {
      setSizes(prev => [...prev, size]);
    }
  };

  const updateSize = (index: number, newSize: string) => {
    setSizes(prev => prev.map((size, i) => i === index ? newSize : size));
  };

  const removeSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  };

  return {
    addCategory,
    updateCategory,
    removeCategory,
    addCollection,
    updateCollection,
    removeCollection,
    addSupplier,
    updateSupplier,
    removeSupplier,
    addBrand,
    updateBrand,
    removeBrand,
    addColor,
    updateColor,
    removeColor,
    addSize,
    updateSize,
    removeSize
  };
};
