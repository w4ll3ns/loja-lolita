
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingCart, LayoutGrid, LayoutList, Upload, Edit } from 'lucide-react';

interface ProductsPageHeaderProps {
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
  selectedProducts: string[];
  canEdit: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  setIsImportXmlOpen: (open: boolean) => void;
  handleBulkEdit: () => void;
}

export const ProductsPageHeader: React.FC<ProductsPageHeaderProps> = ({
  viewMode,
  setViewMode,
  selectedProducts,
  canEdit,
  setIsAddDialogOpen,
  setIsImportXmlOpen,
  handleBulkEdit
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Produtos</h1>
        <p className="text-sm md:text-base text-gray-600">Gerencie o estoque da loja</p>
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
        {/* Toggle de visualização - Hidden on mobile */}
        <div className="hidden md:block">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'cards' | 'list')}>
            <ToggleGroupItem value="cards" aria-label="Visualização em cards">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em lista">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {canEdit && (
          <div className="flex flex-col md:flex-row gap-2">
            {selectedProducts.length > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkEdit}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar em Lote ({selectedProducts.length})
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => setIsImportXmlOpen(true)}
              className="border-store-blue-600 text-store-blue-600 hover:bg-store-blue-50 text-sm"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Importar via NF-e</span>
              <span className="sm:hidden">Importar</span>
            </Button>
            
            <Dialog open={false}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-store-blue-600 hover:bg-store-blue-700 text-sm" 
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Adicionar Produto</span>
                  <span className="sm:hidden">Adicionar</span>
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};
