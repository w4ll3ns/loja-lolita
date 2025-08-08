import { useState } from 'react';
import type { Product } from '@/types/store';

export const useProductsPageState = () => {
  // Search and view states
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportXmlOpen, setIsImportXmlOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Selection states
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Quick add modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddColorOpen, setIsAddColorOpen] = useState(false);
  
  // New item names
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newColorName, setNewColorName] = useState('');
  
  // Product form state
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

  return {
    // Search and view
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    
    // Dialogs
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isImportXmlOpen,
    setIsImportXmlOpen,
    isBulkEditOpen,
    setIsBulkEditOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    
    // Selection
    selectedProducts,
    setSelectedProducts,
    editingProduct,
    setEditingProduct,
    productToDelete,
    setProductToDelete,
    
    // Quick add modals
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
    
    // Product form
    newProduct,
    setNewProduct,
  };
};

