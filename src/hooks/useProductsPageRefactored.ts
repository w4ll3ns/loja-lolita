import { useProductsPageState } from './useProductsPageState';
import { useProductsPageComputed } from './useProductsPageComputed';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductsContext';
import { useDataManagement } from '@/contexts/DataManagementContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import type { Product } from '@/types/store';
import { sanitizeName, sanitizeText, sanitizeBarcode, sanitizeNumber } from '@/utils/sanitization';

export const useProductsPageRefactored = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    addProduct, 
    updateProduct, 
    deleteProduct,
    bulkUpdateProducts,
    duplicateProduct, 
    isBarcodeTaken,
    hasProductBeenSold
  } = useProducts();
  const {
    addCategory, 
    addCollection, 
    addSupplier, 
    addBrand, 
    addColor
  } = useDataManagement();
  const { requirePasswordForDeletion } = useSecuritySettings();

  // Get state from specialized hook
  const state = useProductsPageState();
  
  // Get computed values from specialized hook
  const computed = useProductsPageComputed(state.searchTerm);

  // Selection handlers
  const handleSelectProduct = (productId: string, selected: boolean) => {
    state.setSelectedProducts(prev => 
      selected 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    state.setSelectedProducts(selected ? computed.filteredProducts.map(p => p.id) : []);
  };

  const handleDeleteClick = (product: Product) => {
    state.setProductToDelete(product);
    state.setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async (reason?: string) => {
    if (!state.productToDelete) return;

    try {
      await deleteProduct(state.productToDelete.id, reason);
      state.setDeleteConfirmOpen(false);
      state.setProductToDelete(null);
      state.setSelectedProducts(prev => prev.filter(id => id !== state.productToDelete!.id));
      
      toast({
        title: "Produto excluído",
        description: "Produto foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir produto.",
        variant: "destructive"
      });
    }
  };

  const validatePassword = (password: string): boolean => {
    if (!requirePasswordForDeletion) return true;
    return password === 'admin123'; // In production, this should be more secure
  };

  const handleBulkEdit = () => {
    if (state.selectedProducts.length === 0) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Selecione pelo menos um produto para editar em massa.",
        variant: "destructive"
      });
      return;
    }
    state.setIsBulkEditOpen(true);
  };

  const handleBulkUpdate = async (updates: Partial<Product>) => {
    try {
      await bulkUpdateProducts(state.selectedProducts, updates);
      state.setSelectedProducts([]);
      state.setIsBulkEditOpen(false);
      
      toast({
        title: "Produtos atualizados",
        description: `${state.selectedProducts.length} produtos foram atualizados com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produtos em massa.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    state.setEditingProduct(product);
    state.setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!state.editingProduct) return;

    try {
      // Sanitize inputs
      const sanitizedUpdates = {
        name: sanitizeName(state.editingProduct.name),
        description: sanitizeText(state.editingProduct.description),
        barcode: sanitizeBarcode(state.editingProduct.barcode),
        price: sanitizeNumber(state.editingProduct.price),
        costPrice: sanitizeNumber(state.editingProduct.costPrice),
        quantity: sanitizeNumber(state.editingProduct.quantity),
      };

      await updateProduct(state.editingProduct.id, sanitizedUpdates);
      state.setIsEditDialogOpen(false);
      state.setEditingProduct(null);
      
      toast({
        title: "Produto atualizado",
        description: "Produto foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto.",
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      // Validate required fields
      if (!state.newProduct.name || !state.newProduct.price || !state.newProduct.category) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome, preço e categoria são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Check if barcode is already taken
      if (state.newProduct.barcode && isBarcodeTaken(state.newProduct.barcode)) {
        toast({
          title: "Código de barras duplicado",
          description: "Este código de barras já está em uso.",
          variant: "destructive"
        });
        return;
      }

      // Sanitize inputs
      const sanitizedProduct = {
        name: sanitizeName(state.newProduct.name),
        description: sanitizeText(state.newProduct.description),
        barcode: sanitizeBarcode(state.newProduct.barcode),
        price: sanitizeNumber(state.newProduct.price),
        costPrice: sanitizeNumber(state.newProduct.costPrice),
        quantity: sanitizeNumber(state.newProduct.quantity),
        category: state.newProduct.category,
        collection: state.newProduct.collection,
        size: state.newProduct.size,
        supplier: state.newProduct.supplier,
        brand: state.newProduct.brand,
        color: state.newProduct.color,
        gender: state.newProduct.gender,
      };

      await addProduct(sanitizedProduct);
      state.setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: "Produto adicionado",
        description: "Produto foi adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicatedProduct = duplicateProduct(product);
    state.setNewProduct({
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
      barcode: duplicatedProduct.barcode,
      color: duplicatedProduct.color,
      gender: duplicatedProduct.gender,
    });
    state.setIsAddDialogOpen(true);
  };

  const handleAddCategory = async () => {
    if (!state.newCategoryName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a categoria.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addCategory(state.newCategoryName.trim());
      state.setNewCategoryName('');
      state.setIsAddCategoryOpen(false);
      
      toast({
        title: "Categoria adicionada",
        description: "Categoria foi adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar categoria.",
        variant: "destructive"
      });
    }
  };

  const handleAddCollection = async () => {
    if (!state.newCollectionName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a coleção.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addCollection(state.newCollectionName.trim());
      state.setNewCollectionName('');
      state.setIsAddCollectionOpen(false);
      
      toast({
        title: "Coleção adicionada",
        description: "Coleção foi adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar coleção.",
        variant: "destructive"
      });
    }
  };

  const handleAddBrand = async () => {
    if (!state.newBrandName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a marca.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addBrand(state.newBrandName.trim());
      state.setNewBrandName('');
      state.setIsAddBrandOpen(false);
      
      toast({
        title: "Marca adicionada",
        description: "Marca foi adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar marca.",
        variant: "destructive"
      });
    }
  };

  const handleAddSupplier = async () => {
    if (!state.newSupplierName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o fornecedor.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSupplier(state.newSupplierName.trim());
      state.setNewSupplierName('');
      state.setIsAddSupplierOpen(false);
      
      toast({
        title: "Fornecedor adicionado",
        description: "Fornecedor foi adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar fornecedor.",
        variant: "destructive"
      });
    }
  };

  const handleAddColor = async () => {
    if (!state.newColorName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a cor.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addColor(state.newColorName.trim());
      state.setNewColorName('');
      state.setIsAddColorOpen(false);
      
      toast({
        title: "Cor adicionada",
        description: "Cor foi adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar cor.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    state.setNewProduct({
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
    // This will be handled by the XML import modal
    console.log('Importing products:', importedProducts);
  };

  return {
    // State
    ...state,
    
    // Data
    ...computed,
    
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

