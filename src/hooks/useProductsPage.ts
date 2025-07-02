
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types/store';

export const useProductsPage = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    bulkUpdateProducts,
    categories, 
    collections, 
    suppliers, 
    brands, 
    colors,
    sizes,
    addCategory, 
    addCollection, 
    addSupplier, 
    addBrand, 
    addColor, 
    duplicateProduct, 
    isBarcodeTaken,
    hasProductBeenSold
  } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [isImportXmlOpen, setIsImportXmlOpen] = useState(false);
  
  // Selection and bulk edit states
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  
  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Estados para modais de adição rápida
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);

  // Estados para novos itens
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newColorName, setNewColorName] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    category: '',
    collection: '',
    size: '',
    supplier: '',
    brand: '',
    quantity: '',
    barcode: '',
    color: '',
    gender: '' as 'Masculino' | 'Feminino' | 'Unissex' | ''
  });

  const genders = ['Masculino', 'Feminino', 'Unissex'];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  // Calculate totals for products in stock
  const stockTotals = filteredProducts.reduce((acc, product) => {
    if (product.quantity > 0) {
      acc.totalCost += product.costPrice * product.quantity;
      acc.totalSaleValue += product.price * product.quantity;
    }
    return acc;
  }, { totalCost: 0, totalSaleValue: 0 });

  // Selection handlers
  const handleSelectProduct = (productId: string, selected: boolean) => {
    setSelectedProducts(prev => 
      selected 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedProducts(selected ? filteredProducts.map(p => p.id) : []);
  };

  // Delete handlers
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = (reason?: string) => {
    if (!productToDelete || !user) return;
    
    deleteProduct(productToDelete.id, reason);
    
    toast({
      title: "Produto excluído",
      description: `O produto "${productToDelete.name}" foi excluído com sucesso.`,
    });
    
    setSelectedProducts(prev => prev.filter(id => id !== productToDelete.id));
    setProductToDelete(null);
  };

  const validatePassword = (password: string): boolean => {
    return password === '123456';
  };

  // Bulk edit handlers
  const handleBulkEdit = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um produto para editar",
        variant: "destructive",
      });
      return;
    }
    setIsBulkEditOpen(true);
  };

  const handleBulkUpdate = (updates: Partial<Product>) => {
    bulkUpdateProducts(selectedProducts, updates);
    setSelectedProducts([]);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
      category: product.category,
      collection: product.collection,
      size: product.size,
      supplier: product.supplier,
      brand: product.brand,
      quantity: product.quantity.toString(),
      barcode: product.barcode,
      color: product.color,
      gender: product.gender
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    if (!newProduct.name || !newProduct.price || !newProduct.costPrice || !newProduct.category || !newProduct.gender) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (Nome, Preço, Preço de Custo, Categoria e Gênero)",
        variant: "destructive",
      });
      return;
    }

    if (newProduct.barcode && isBarcodeTaken(newProduct.barcode, editingProduct.id)) {
      toast({
        title: "Erro",
        description: "Este código de barras já está sendo usado por outro produto",
        variant: "destructive",
      });
      return;
    }

    updateProduct(editingProduct.id, {
      ...newProduct,
      price: parseFloat(newProduct.price),
      costPrice: parseFloat(newProduct.costPrice),
      quantity: parseInt(newProduct.quantity) || 0,
      barcode: newProduct.barcode || editingProduct.barcode,
      gender: newProduct.gender as 'Masculino' | 'Feminino' | 'Unissex'
    });

    toast({
      title: "Sucesso",
      description: "Produto atualizado com sucesso!",
    });

    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.costPrice || !newProduct.category || !newProduct.gender) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (Nome, Preço, Preço de Custo, Categoria e Gênero)",
        variant: "destructive",
      });
      return;
    }

    if (newProduct.barcode && isBarcodeTaken(newProduct.barcode)) {
      toast({
        title: "Erro",
        description: "Este código de barras já está sendo usado por outro produto",
        variant: "destructive",
      });
      return;
    }

    addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      costPrice: parseFloat(newProduct.costPrice),
      quantity: parseInt(newProduct.quantity) || 0,
      barcode: newProduct.barcode || Date.now().toString(),
      gender: newProduct.gender as 'Masculino' | 'Feminino' | 'Unissex'
    });

    toast({
      title: "Sucesso",
      description: "Produto adicionado com sucesso!",
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicatedProduct = duplicateProduct(product);
    setNewProduct({
      name: duplicatedProduct.name,
      description: duplicatedProduct.description,
      price: duplicatedProduct.price.toString(),
      costPrice: duplicatedProduct.costPrice.toString(),
      category: duplicatedProduct.category,
      collection: duplicatedProduct.collection,
      size: duplicatedProduct.size,
      supplier: duplicatedProduct.supplier,
      brand: duplicatedProduct.brand,
      quantity: duplicatedProduct.quantity.toString(),
      barcode: '',
      color: duplicatedProduct.color,
      gender: duplicatedProduct.gender
    });
    setIsAddDialogOpen(true);
    
    toast({
      title: "Produto duplicado",
      description: "Formulário preenchido com os dados do produto. Lembre-se de alterar o código de barras!",
    });
  };

  // Funções para adicionar novos itens
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    addCategory(newCategoryName.trim());
    setNewProduct({ ...newProduct, category: newCategoryName.trim() });
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Nova categoria adicionada!",
    });
  };

  const handleAddCollection = () => {
    if (!newCollectionName.trim()) return;
    
    addCollection(newCollectionName.trim());
    setNewProduct({ ...newProduct, collection: newCollectionName.trim() });
    setNewCollectionName('');
    setIsAddCollectionOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Nova coleção adicionada!",
    });
  };

  const handleAddBrand = () => {
    if (!newBrandName.trim()) return;
    
    addBrand(newBrandName.trim());
    setNewProduct({ ...newProduct, brand: newBrandName.trim() });
    setNewBrandName('');
    setIsAddBrandOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Nova marca adicionada!",
    });
  };

  const handleAddSupplier = () => {
    if (!newSupplierName.trim()) return;
    
    addSupplier(newSupplierName.trim());
    setNewProduct({ ...newProduct, supplier: newSupplierName.trim() });
    setNewSupplierName('');
    setIsAddSupplierOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Novo fornecedor adicionado!",
    });
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    
    addColor(newColorName.trim());
    setNewProduct({ ...newProduct, color: newColorName.trim() });
    setNewColorName('');
    setIsAddColorOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Nova cor adicionada!",
    });
  };

  const canEdit = user?.role === 'admin' || user?.role === 'vendedor' || user?.role === 'caixa';
  const canAddStructuralData = user?.role === 'admin';

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      costPrice: '',
      category: '',
      collection: '',
      size: '',
      supplier: '',
      brand: '',
      quantity: '',
      barcode: '',
      color: '',
      gender: ''
    });
  };

  const handleImportFromXml = (importedProducts: any[]) => {
    importedProducts.forEach(product => {
      addProduct(product);
    });

    toast({
      title: "Importação concluída",
      description: `${importedProducts.length} produtos importados com sucesso!`,
    });
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingProduct,
    setEditingProduct,
    viewMode,
    setViewMode,
    isImportXmlOpen,
    setIsImportXmlOpen,
    selectedProducts,
    setSelectedProducts,
    isBulkEditOpen,
    setIsBulkEditOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    productToDelete,
    setProductToDelete,
    
    // Quick add modals state
    isAddCategoryOpen,
    setIsAddCategoryOpen,
    isAddCollectionOpen,
    setIsAddCollectionOpen,
    isAddBrandOpen,
    setIsAddBrandOpen,
    isAddSupplierOpen,
    setIsAddSupplierOpen,
    isAddColorOpen,
    setIsAddColorOpen,
    
    // New item names
    newCategoryName,
    setNewCategoryName,
    newCollectionName,
    setNewCollectionName,
    newBrandName,
    setNewBrandName,
    newSupplierName,
    setNewSupplierName,
    newColorName,
    setNewColorName,
    
    // Product form state
    newProduct,
    setNewProduct,
    
    // Data
    filteredProducts,
    stockTotals,
    categories,
    collections,
    suppliers,
    brands,
    colors,
    sizes,
    genders,
    
    // Permissions
    canEdit,
    canAddStructuralData,
    
    // Handlers
    handleSelectProduct,
    handleSelectAll,
    handleDeleteClick,
    handleDeleteConfirm,
    validatePassword,
    handleBulkEdit,
    handleBulkUpdate,
    handleEditProduct,
    handleSaveEdit,
    handleAddProduct,
    handleDuplicateProduct,
    handleAddCategory,
    handleAddCollection,
    handleAddBrand,
    handleAddSupplier,
    handleAddColor,
    resetForm,
    handleImportFromXml,
    hasProductBeenSold
  };
};
