import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, ShoppingCart, Plus, Copy, LayoutGrid, LayoutList, Pencil } from 'lucide-react';
import type { Product } from '@/contexts/StoreContext';

const ProductsPage = () => {
  const { products, addProduct, updateProduct, categories, collections, suppliers, brands, colors, addCategory, addCollection, addSupplier, addBrand, addColor, duplicateProduct, isBarcodeTaken } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

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

  const sizes = ['PP', 'P', 'M', 'G', 'GG', '34', '36', '38', '40', '42', '44'];
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
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
    
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.gender) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (Nome, Preço, Categoria e Gênero)",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o código de barras já existe para outro produto
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
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.gender) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (Nome, Preço, Categoria e Gênero)",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o código de barras já existe
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
      quantity: parseInt(newProduct.quantity) || 0,
      barcode: newProduct.barcode || Date.now().toString(),
      gender: newProduct.gender as 'Masculino' | 'Feminino' | 'Unissex'
    });

    toast({
      title: "Sucesso",
      description: "Produto adicionado com sucesso!",
    });

    setNewProduct({
      name: '',
      description: '',
      price: '',
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
    setIsAddDialogOpen(false);
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicatedProduct = duplicateProduct(product);
    setNewProduct({
      name: duplicatedProduct.name,
      description: duplicatedProduct.description,
      price: duplicatedProduct.price.toString(),
      category: duplicatedProduct.category,
      collection: duplicatedProduct.collection,
      size: duplicatedProduct.size,
      supplier: duplicatedProduct.supplier,
      brand: duplicatedProduct.brand,
      quantity: duplicatedProduct.quantity.toString(),
      barcode: '', // Sempre vazio para evitar duplicação
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

  const canEdit = user?.role === 'admin';
  const canAddStructuralData = user?.role === 'admin'; // Só admin pode adicionar categorias, marcas, etc.

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-store-blue-600 hover:bg-store-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Produto</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Gênero */}
                  <div className="col-span-2 space-y-2">
                    <Label>Gênero *</Label>
                    <RadioGroup
                      value={newProduct.gender}
                      onValueChange={(value) => setNewProduct({ ...newProduct, gender: value as 'Masculino' | 'Feminino' | 'Unissex' })}
                      className="flex flex-row gap-6"
                    >
                      {genders.map((gender) => (
                        <div key={gender} className="flex items-center space-x-2">
                          <RadioGroupItem value={gender} id={gender} />
                          <Label htmlFor={gender}>{gender}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Categoria com opção de adicionar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category">Categoria *</Label>
                      {canAddStructuralData && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddCategoryOpen(true)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Nova
                        </Button>
                      )}
                    </div>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })} value={newProduct.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cor com opção de adicionar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="color">Cor *</Label>
                      {canAddStructuralData && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddColorOpen(true)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Nova
                        </Button>
                      )}
                    </div>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, color: value })} value={newProduct.color}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Coleção com opção de adicionar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="collection">Coleção</Label>
                      {canAddStructuralData && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddCollectionOpen(true)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Nova
                        </Button>
                      )}
                    </div>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, collection: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma coleção" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {collections.map((col) => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Tamanho</Label>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, size: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tamanho" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  {/* Marca com opção de adicionar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brand">Marca</Label>
                      {canAddStructuralData && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddBrandOpen(true)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Nova
                        </Button>
                      )}
                    </div>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma marca" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fornecedor com opção de adicionar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="supplier">Fornecedor</Label>
                      {canAddStructuralData && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddSupplierOpen(true)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Novo
                        </Button>
                      )}
                    </div>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, supplier: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Descrição do produto"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <Input
                      id="barcode"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                      placeholder="Deixe vazio para gerar automaticamente"
                      className={!newProduct.barcode ? 'border-orange-300 bg-orange-50' : ''}
                    />
                    {!newProduct.barcode && (
                      <p className="text-xs text-orange-600">⚠️ Código de barras deve ser único para cada produto</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddProduct} className="bg-store-blue-600 hover:bg-store-blue-700">
                    Adicionar Produto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingProduct(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Preço *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {/* Gênero */}
            <div className="col-span-2 space-y-2">
              <Label>Gênero *</Label>
              <RadioGroup
                value={newProduct.gender}
                onValueChange={(value) => setNewProduct({ ...newProduct, gender: value as 'Masculino' | 'Feminino' | 'Unissex' })}
                className="flex flex-row gap-6"
              >
                {genders.map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <RadioGroupItem value={gender} id={`edit-${gender}`} />
                    <Label htmlFor={`edit-${gender}`}>{gender}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria *</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })} value={newProduct.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label htmlFor="edit-color">Cor</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, color: value })} value={newProduct.color}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cor" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Outros campos seguem o mesmo padrão... */}
            <div className="space-y-2">
              <Label htmlFor="edit-collection">Coleção</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, collection: value })} value={newProduct.collection}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma coleção" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {collections.map((col) => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-size">Tamanho</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, size: value })} value={newProduct.size}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tamanho" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantidade</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-brand">Marca</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })} value={newProduct.brand}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Fornecedor</Label>
              <Select onValueChange={(value) => setNewProduct({ ...newProduct, supplier: value })} value={newProduct.supplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Descrição do produto"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-barcode">Código de Barras</Label>
              <Input
                id="edit-barcode"
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                placeholder="Código de barras do produto"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="bg-store-blue-600 hover:bg-store-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Cor */}
      <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Cor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newColor">Nome da Cor</Label>
              <Input
                id="newColor"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Ex: Azul Marinho"
                onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddColorOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddColor} disabled={!newColorName.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Categoria */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Nome da Categoria</Label>
              <Input
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Acessórios"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Coleção */}
      <Dialog open={isAddCollectionOpen} onOpenChange={setIsAddCollectionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Coleção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newCollection">Nome da Coleção</Label>
              <Input
                id="newCollection"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Ex: Outono 2024"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCollection()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddCollectionOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCollection} disabled={!newCollectionName.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Marca */}
      <Dialog open={isAddBrandOpen} onOpenChange={setIsAddBrandOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Marca</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newBrand">Nome da Marca</Label>
              <Input
                id="newBrand"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Ex: Nike"
                onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddBrandOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddBrand} disabled={!newBrandName.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Novo Fornecedor */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Fornecedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newSupplier">Nome do Fornecedor</Label>
              <Input
                id="newSupplier"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="Ex: Distribuidora ABC"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSupplier()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSupplier} disabled={!newSupplierName.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            <Card key={product.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex gap-1">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="text-gray-500 hover:text-blue-600 p-1"
                        title="Editar produto"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicateProduct(product)}
                        className="text-gray-500 hover:text-green-600 p-1"
                        title="Duplicar produto"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{product.category} - {product.size}</p>
                  <p>{product.brand} - {product.color}</p>
                  <p className="font-medium text-blue-600">{product.gender}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="font-semibold text-store-green-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
                    <span className={`font-semibold ${
                      product.quantity <= 5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.quantity} unidades
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Código:</span>
                    <span className="text-xs font-mono">{product.barcode}</span>
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Código</TableHead>
                {canEdit && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.color}</TableCell>
                  <TableCell>{product.size}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.gender}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-store-green-600">
                    R$ {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      product.quantity <= 5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.barcode}</TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="text-gray-500 hover:text-blue-600"
                          title="Editar produto"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateProduct(product)}
                          className="text-gray-500 hover:text-green-600"
                          title="Duplicar produto"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
