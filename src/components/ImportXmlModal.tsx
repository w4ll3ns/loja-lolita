
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  // Campos inferidos
  size?: string;
  gender?: 'Masculino' | 'Feminino' | 'Unissex';
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
  const [editingProduct, setEditingProduct] = useState<XmlProduct | null>(null);
  const { toast } = useToast();

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

      // Verificar se é um XML válido
      if (xmlDoc.documentElement.nodeName === 'parsererror') {
        throw new Error('XML inválido');
      }

      // Extrair produtos da NF-e
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

          // Inferir tamanho e gênero
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
            size,
            gender,
            selected: true
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

    // Converter para formato do sistema
    const productsToImport = selectedProducts.map(p => ({
      name: p.xProd,
      description: `Importado via NF-e - Código: ${p.cProd}`,
      price: parseFloat(p.vUnCom.replace(',', '.')),
      category: 'Importado',
      collection: 'NF-e',
      size: p.size || '',
      supplier: 'A definir',
      brand: 'A definir',
      quantity: parseInt(p.qCom.replace(',', '.')),
      barcode: p.cEAN || p.cProd,
      color: 'A definir',
      gender: p.gender
    }));

    onImport(productsToImport);
    handleClose();
  };

  const handleClose = () => {
    setXmlFile(null);
    setExtractedProducts([]);
    setStep('upload');
    setEditingProduct(null);
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Código de Barras</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Gênero</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox 
                          checked={product.selected}
                          onCheckedChange={() => toggleProductSelection(index)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.xProd}</TableCell>
                      <TableCell className="font-mono text-xs">{product.cProd}</TableCell>
                      <TableCell className="font-mono text-xs">{product.cEAN || '-'}</TableCell>
                      <TableCell>{product.qCom}</TableCell>
                      <TableCell>R$ {parseFloat(product.vUnCom.replace(',', '.')).toFixed(2)}</TableCell>
                      <TableCell>{product.size || '-'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.gender}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Voltar
              </Button>
              <Button 
                onClick={handleImportProducts}
                disabled={extractedProducts.filter(p => p.selected).length === 0}
                className="bg-store-green-600 hover:bg-store-green-700"
              >
                Importar Produtos Selecionados
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
