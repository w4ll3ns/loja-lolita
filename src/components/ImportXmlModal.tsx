import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, Edit2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { useStore } from '@/contexts/StoreContext';

interface XmlProduct {
  cProd: string;
  cEAN: string;
  xProd: string;
  qCom: string;
  uCom: string;
  vUnCom: string;
  vProd: string;
  NCM?: string;
  CFOP?: string;
  xPed?: string;
  selected: boolean;
  // Campos editáveis
  editableName: string;
  editableBarcode: string;
  editableQuantity: string;
  editableUnit: string;
  editableCostPrice: string;
  editableSalePrice: string;
  editableCategory: string;
  editableSize: string;
  editableGender: 'Masculino' | 'Feminino' | 'Unissex';
  editableSupplier: string;
  editableBrand: string;
  editableColor: string;
}

interface ImportXmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => void;
}

export const ImportXmlModal: React.FC<ImportXmlModalProps> = ({ isOpen, onClose, onImport }) => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [extractedProducts, setExtractedProducts] = useState<XmlProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'edit'>('upload');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<{ [key: number]: boolean }>({});
  const { categories, suppliers, brands, colors, addCategory, addSupplier, addBrand, addColor } = useStore();
  const { toast } = useToast();

  const sizes = ['PP', 'P', 'M', 'G', 'GG', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52'];
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      toast({
        title: "Erro",
        description: "Selecione apenas arquivos XML",
        variant: "destructive",
      });
      return;
    }

    setXmlFile(file);
  };

  const inferSizeFromProduct = (productName: string, productCode: string): string => {
    const sizePattern = /\b(PP|P|M|G|GG|XG|XXG|34|36|38|40|42|44|46|48|50|52)\b/i;
    const match = productName.match(sizePattern) || productCode.match(sizePattern);
    return match ? match[0].toUpperCase() : '';
  };

  const inferGenderFromProduct = (productName: string): 'Masculino' | 'Feminino' | 'Unissex' => {
    const productNameLower = productName.toLowerCase();
    if (productNameLower.includes('masc') || productNameLower.includes('masculino') || productNameLower.includes('homem')) {
      return 'Masculino';
    }
    if (productNameLower.includes('fem') || productNameLower.includes('feminino') || productNameLower.includes('mulher')) {
      return 'Feminino';
    }
    return 'Unissex';
  };

  const processXmlFile = async () => {
    if (!xmlFile) return;

    setIsProcessing(true);
    try {
      const xmlText = await xmlFile.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      if (xmlDoc.documentElement.nodeName === 'parsererror') {
        throw new Error('XML inválido');
      }

      const detElements = xmlDoc.getElementsByTagName('det');
      const products: XmlProduct[] = [];

      for (let i = 0; i < detElements.length; i++) {
        const det = detElements[i];
        const prod = det.getElementsByTagName('prod')[0];
        
        if (prod) {
          const cProd = prod.getElementsByTagName('cProd')[0]?.textContent || '';
          const cEAN = prod.getElementsByTagName('cEAN')[0]?.textContent || 
                       prod.getElementsByTagName('cEANTrib')[0]?.textContent || '';
          const xProd = prod.getElementsByTagName('xProd')[0]?.textContent || '';
          const qCom = prod.getElementsByTagName('qCom')[0]?.textContent || '0';
          const uCom = prod.getElementsByTagName('uCom')[0]?.textContent || 'UN';
          const vUnCom = prod.getElementsByTagName('vUnCom')[0]?.textContent || '0';
          const vProd = prod.getElementsByTagName('vProd')[0]?.textContent || '0';
          const NCM = prod.getElementsByTagName('NCM')[0]?.textContent || '';
          const CFOP = prod.getElementsByTagName('CFOP')[0]?.textContent || '';
          const xPed = prod.getElementsByTagName('xPed')[0]?.textContent || '';

          const costPrice = parseFloat(vUnCom.replace(',', '.')) || 0;
          const suggestedSalePrice = costPrice * 1.5; // Margem sugerida de 50%

          const size = inferSizeFromProduct(xProd, cProd);
          const gender = inferGenderFromProduct(xProd);

          products.push({
            cProd,
            cEAN: cEAN === 'SEM GTIN' ? '' : cEAN,
            xProd,
            qCom,
            uCom,
            vUnCom,
            vProd,
            NCM,
            CFOP,
            xPed,
            selected: true,
            // Campos editáveis inicializados
            editableName: xProd,
            editableBarcode: cEAN === 'SEM GTIN' ? '' : cEAN,
            editableQuantity: qCom,
            editableUnit: uCom,
            editableCostPrice: costPrice.toFixed(2),
            editableSalePrice: suggestedSalePrice.toFixed(2),
            editableCategory: 'Importado',
            editableSize: size,
            editableGender: gender,
            editableSupplier: 'A definir',
            editableBrand: 'A definir',
            editableColor: 'A definir'
          });
        }
      }

      if (products.length === 0) {
        throw new Error('Nenhum produto encontrado no XML');
      }

      setExtractedProducts(products);
      setStep('preview');
      
      toast({
        title: "Sucesso",
        description: `${products.length} produtos extraídos do XML`,
      });
    } catch (error) {
      toast({
        title: "Erro ao processar XML",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleProductSelection = (index: number) => {
    setExtractedProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, selected: !product.selected } : product
    ));
  };

  const updateProductField = (index: number, field: keyof XmlProduct, value: any) => {
    setExtractedProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const handleEditProduct = (index: number) => {
    setEditingIndex(index);
    setStep('edit');
  };

  const handleSaveEdit = () => {
    setStep('preview');
    setEditingIndex(null);
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso",
    });
  };

  const handleAddNewCategory = (index: number) => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      updateProductField(index, 'editableCategory', newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategoryInput(prev => ({ ...prev, [index]: false }));
      toast({
        title: "Categoria adicionada",
        description: `A categoria "${newCategoryName.trim()}" foi criada`,
      });
    }
  };

  const formatCurrency = (value: string): string => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handlePriceChange = (index: number, field: 'editableCostPrice' | 'editableSalePrice', value: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^\d.,]/g, '');
    // Converte vírgula para ponto para cálculos
    const numericValue = cleanValue.replace(',', '.');
    
    updateProductField(index, field, numericValue);
  };

  const handleImportProducts = () => {
    const selectedProducts = extractedProducts.filter(p => p.selected);
    
    if (selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um produto para importar",
        variant: "destructive",
      });
      return;
    }

    const productsToImport = selectedProducts.map(p => ({
      name: p.editableName,
      description: `Importado via NF-e - Código: ${p.cProd}`,
      price: parseFloat(p.editableSalePrice),
      costPrice: parseFloat(p.editableCostPrice),
      category: p.editableCategory,
      collection: 'NF-e',
      size: p.editableSize,
      supplier: p.editableSupplier,
      brand: p.editableBrand,
      quantity: parseInt(p.editableQuantity),
      barcode: p.editableBarcode || p.cProd,
      color: p.editableColor,
      gender: p.editableGender
    }));

    onImport(productsToImport);
    handleClose();
  };

  const handleClose = () => {
    setXmlFile(null);
    setExtractedProducts([]);
    setStep('upload');
    setEditingIndex(null);
    setShowNewCategoryInput({});
    setNewCategoryName('');
    onClose();
  };

  const selectAll = () => {
    setExtractedProducts(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setExtractedProducts(prev => prev.map(p => ({ ...p, selected: false })));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar Produtos via NF-e
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload do XML da NF-e</CardTitle>
                <CardDescription>
                  Selecione o arquivo XML da Nota Fiscal Eletrônica para extrair os produtos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="xmlFile">Arquivo XML</Label>
                  <Input
                    id="xmlFile"
                    type="file"
                    accept=".xml"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                
                {xmlFile && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Arquivo selecionado: {xmlFile.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                onClick={processXmlFile} 
                disabled={!xmlFile || isProcessing}
                className="bg-store-blue-600 hover:bg-store-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Processar XML
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Produtos Extraídos ({extractedProducts.filter(p => p.selected).length} de {extractedProducts.length} selecionados)
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Selecionar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Desmarcar Todos
                </Button>
              </div>
            </div>

            <div className="border rounded-lg max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={extractedProducts.every(p => p.selected)}
                        onCheckedChange={(checked) => {
                          if (checked) selectAll();
                          else deselectAll();
                        }}
                      />
                    </TableHead>
                    <TableHead className="min-w-48">Produto</TableHead>
                    <TableHead className="min-w-32">Código</TableHead>
                    <TableHead className="min-w-32">Preço Custo</TableHead>
                    <TableHead className="min-w-32">Preço Venda</TableHead>
                    <TableHead className="min-w-32">Margem</TableHead>
                    <TableHead className="min-w-32">Categoria</TableHead>
                    <TableHead className="min-w-24">Tamanho</TableHead>
                    <TableHead className="min-w-28">Gênero</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedProducts.map((product, index) => {
                    const salePrice = parseFloat(product.editableSalePrice) || 0;
                    const costPrice = parseFloat(product.editableCostPrice) || 0;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox 
                            checked={product.selected}
                            onCheckedChange={() => toggleProductSelection(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={product.editableName}
                            onChange={(e) => updateProductField(index, 'editableName', e.target.value)}
                            className="min-w-44"
                            placeholder="Nome do produto"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={product.editableBarcode}
                            onChange={(e) => updateProductField(index, 'editableBarcode', e.target.value)}
                            className="font-mono text-xs"
                            placeholder="Código"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={product.editableCostPrice}
                            onChange={(e) => handlePriceChange(index, 'editableCostPrice', e.target.value)}
                            placeholder="0,00"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={product.editableSalePrice}
                            onChange={(e) => handlePriceChange(index, 'editableSalePrice', e.target.value)}
                            placeholder="0,00"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <ProfitMarginDisplay 
                            salePrice={salePrice} 
                            costPrice={costPrice}
                            className="text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Select
                              value={product.editableCategory}
                              onValueChange={(value) => {
                                if (value === 'add-new') {
                                  setShowNewCategoryInput(prev => ({ ...prev, [index]: true }));
                                } else {
                                  updateProductField(index, 'editableCategory', value);
                                }
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                                <SelectItem value="add-new">
                                  <div className="flex items-center gap-2">
                                    <Plus className="h-3 w-3" />
                                    <span>Adicionar novo</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {showNewCategoryInput[index] && (
                              <div className="flex gap-1">
                                <Input
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  placeholder="Nova categoria"
                                  className="text-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddNewCategory(index);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddNewCategory(index)}
                                  className="px-2"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.editableSize}
                            onValueChange={(value) => updateProductField(index, 'editableSize', value)}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              {sizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.editableGender}
                            onValueChange={(value) => updateProductField(index, 'editableGender', value as 'Masculino' | 'Feminino' | 'Unissex')}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {genders.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(index)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edição avançada"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Voltar
              </Button>
              <Button 
                onClick={handleImportProducts}
                disabled={extractedProducts.filter(p => p.selected).length === 0}
                className="bg-store-green-600 hover:bg-store-green-700"
              >
                Importar Produtos Selecionados ({extractedProducts.filter(p => p.selected).length})
              </Button>
            </div>
          </div>
        )}

        {step === 'edit' && editingIndex !== null && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Edição Avançada: {extractedProducts[editingIndex].editableName}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Produto *</Label>
                    <Input
                      value={extractedProducts[editingIndex].editableName}
                      onChange={(e) => updateProductField(editingIndex, 'editableName', e.target.value)}
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Código de Barras</Label>
                    <Input
                      value={extractedProducts[editingIndex].editableBarcode}
                      onChange={(e) => updateProductField(editingIndex, 'editableBarcode', e.target.value)}
                      placeholder="Código de barras"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade *</Label>
                      <Input
                        type="number"
                        value={extractedProducts[editingIndex].editableQuantity}
                        onChange={(e) => updateProductField(editingIndex, 'editableQuantity', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unidade</Label>
                      <Input
                        value={extractedProducts[editingIndex].editableUnit}
                        onChange={(e) => updateProductField(editingIndex, 'editableUnit', e.target.value)}
                        placeholder="UN"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preços e margem */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preços e Margem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preço de Custo *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={extractedProducts[editingIndex].editableCostPrice}
                      onChange={(e) => updateProductField(editingIndex, 'editableCostPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preço de Venda *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={extractedProducts[editingIndex].editableSalePrice}
                      onChange={(e) => updateProductField(editingIndex, 'editableSalePrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Margem de Lucro</Label>
                    <ProfitMarginDisplay 
                      salePrice={parseFloat(extractedProducts[editingIndex].editableSalePrice) || 0}
                      costPrice={parseFloat(extractedProducts[editingIndex].editableCostPrice) || 0}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Classificação */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Classificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select
                      value={extractedProducts[editingIndex].editableCategory}
                      onValueChange={(value) => updateProductField(editingIndex, 'editableCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tamanho</Label>
                    <Select
                      value={extractedProducts[editingIndex].editableSize}
                      onValueChange={(value) => updateProductField(editingIndex, 'editableSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gênero *</Label>
                    <Select
                      value={extractedProducts[editingIndex].editableGender}
                      onValueChange={(value) => updateProductField(editingIndex, 'editableGender', value as 'Masculino' | 'Feminino' | 'Unissex')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Fornecedor e Marca */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Fornecedor e Marca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Select
                      value={extractedProducts[editingIndex].editableSupplier}
                      onValueChange={(value) => updateProductField(editingIndex, 'editableSupplier', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Select
                      value={extractedProducts[editingIndex].editableBrand}
                      onValueChange={(value) => updateProductField(editingIndex, 'editableBrand', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cor</Label>
                    <Select
                      value={extractedProducts[editingIndex].editableColor}
                      onValueChange={(value) => updateProductField(editingIndex, 'editableColor', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('preview')}>
                Voltar à Lista
              </Button>
              <Button onClick={handleSaveEdit} className="bg-store-blue-600 hover:bg-store-blue-700">
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
