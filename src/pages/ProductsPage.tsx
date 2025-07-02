import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingCart, LayoutGrid, LayoutList, Upload, Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/contexts/StoreContext';
import { ImportXmlModal } from '@/components/ImportXmlModal';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductTable } from '@/components/products/ProductTable';
import { QuickAddModals } from '@/components/products/QuickAddModals';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { BulkEditModal } from '@/components/products/BulkEditModal';

const ProductsPage = () => {
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

  // Remove the hardcoded sizes array since we're now using sizes from context
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

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
    
    deleteProduct(productToDelete.id, user.id, user.name, reason);
    
    toast({
      title: "Produto excluído",
      description: `O produto "${productToDelete.name}" foi excluído com sucesso.`,
    });
    
    // Remove from selected products if it was selected
    setSelectedProducts(prev => prev.filter(id => id !== productToDelete.id));
    setProductToDelete(null);
  };

  const validatePassword = (password: string): boolean => {
    // Simple password validation - in a real app, this would verify against the user's actual password
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o estoque da loja</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Toggle de visualização */}
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'cards' | 'list')}>
            <ToggleGroupItem value="cards" aria-label="Visualização em cards">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em lista">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          {canEdit && (
            <div className="flex gap-2">
              {selectedProducts.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBulkEdit}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar em Lote ({selectedProducts.length})
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setIsImportXmlOpen(true)}
                className="border-store-blue-600 text-store-blue-600 hover:bg-store-blue-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar via NF-e
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-store-blue-600 hover:bg-store-blue-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ImportXmlModal
        isOpen={isImportXmlOpen}
        onClose={() => setIsImportXmlOpen(false)}
        onImport={handleImportFromXml}
      />

      <BulkEditModal
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        selectedProducts={filteredProducts.filter(p => selectedProducts.includes(p.id))}
        onBulkUpdate={handleBulkUpdate}
        categories={categories}
        suppliers={suppliers}
        sizes={sizes}
        genders={genders}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || ''}
        requiresPassword={productToDelete ? hasProductBeenSold(productToDelete.id) : false}
        onPasswordValidate={validatePassword}
      />

      {/* Product Forms */}
      <ProductForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddProduct}
        product={newProduct}
        setProduct={setNewProduct}
        categories={categories}
        collections={collections}
        suppliers={suppliers}
        brands={brands}
        colors={colors}
        sizes={sizes}
        genders={genders}
        title="Adicionar Novo Produto"
        canAddStructuralData={canAddStructuralData}
        onAddCategory={() => setIsAddCategoryOpen(true)}
        onAddCollection={() => setIsAddCollectionOpen(true)}
        onAddBrand={() => setIsAddBrandOpen(true)}
        onAddSupplier={() => setIsAddSupplierOpen(true)}
        onAddColor={() => setIsAddColorOpen(true)}
      />

      <ProductForm
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingProduct(null);
          resetForm();
        }}
        onSave={handleSaveEdit}
        product={newProduct}
        setProduct={setNewProduct}
        categories={categories}
        collections={collections}
        suppliers={suppliers}
        brands={brands}
        colors={colors}
        sizes={sizes}
        genders={genders}
        title="Editar Produto"
        canAddStructuralData={false}
        onAddCategory={() => {}}
        onAddCollection={() => {}}
        onAddBrand={() => {}}
        onAddSupplier={() => {}}
        onAddColor={() => {}}
      />

      {/* Quick Add Modals */}
      <QuickAddModals
        categoryModal={{
          isOpen: isAddCategoryOpen,
          value: newCategoryName,
          onClose: () => setIsAddCategoryOpen(false),
          onAdd: handleAddCategory,
          onChange: setNewCategoryName
        }}
        collectionModal={{
          isOpen: isAddCollectionOpen,
          value: newCollectionName,
          onClose: () => setIsAddCollectionOpen(false),
          onAdd: handleAddCollection,
          onChange: setNewCollectionName
        }}
        brandModal={{
          isOpen: isAddBrandOpen,
          value: newBrandName,
          onClose: () => setIsAddBrandOpen(false),
          onAdd: handleAddBrand,
          onChange: setNewBrandName
        }}
        supplierModal={{
          isOpen: isAddSupplierOpen,
          value: newSupplierName,
          onClose: () => setIsAddSupplierOpen(false),
          onAdd: handleAddSupplier,
          onChange: setNewSupplierName
        }}
        colorModal={{
          isOpen: isAddColorOpen,
          value: newColorName,
          onClose: () => setIsAddColorOpen(false),
          onAdd: handleAddColor,
          onChange: setNewColorName
        }}
      />

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar produtos por nome, categoria ou código de barras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de produtos - Visualização condicional */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              canEdit={canEdit}
              onEdit={handleEditProduct}
              onDuplicate={handleDuplicateProduct}
              onDelete={handleDeleteClick}
              isSelected={selectedProducts.includes(product.id)}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          canEdit={canEdit}
          onEdit={handleEditProduct}
          onDuplicate={handleDuplicateProduct}
          onDelete={handleDeleteClick}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onSelectAll={handleSelectAll}
        />
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
