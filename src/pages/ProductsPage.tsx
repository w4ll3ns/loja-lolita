
import React from 'react';
import { ImportXmlModal } from '@/components/ImportXmlModal';
import { ProductForm } from '@/components/products/ProductForm';
import { QuickAddModals } from '@/components/products/QuickAddModals';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { BulkEditModal } from '@/components/products/BulkEditModal';
import { ProductsPageHeader } from '@/components/products/ProductsPageHeader';
import { ProductsPageFilters } from '@/components/products/ProductsPageFilters';
import { ProductsPageContent } from '@/components/products/ProductsPageContent';
import { useProductsPage } from '@/hooks/useProductsPage';

const ProductsPage = () => {
  const {
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
  } = useProductsPage();

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 animate-fade-in pb-20 md:pb-6">
      <ProductsPageHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedProducts={selectedProducts}
        canEdit={canEdit}
        setIsAddDialogOpen={setIsAddDialogOpen}
        setIsImportXmlOpen={setIsImportXmlOpen}
        handleBulkEdit={handleBulkEdit}
      />

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

      <ProductsPageFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Stock Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Custo em Estoque</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {stockTotals.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Valor de Venda em Estoque</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {stockTotals.totalSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductsPageContent
        filteredProducts={filteredProducts}
        viewMode={viewMode}
        canEdit={canEdit}
        onEdit={handleEditProduct}
        onDuplicate={handleDuplicateProduct}
        onDelete={handleDeleteClick}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default ProductsPage;
