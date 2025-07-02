
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Ruler } from 'lucide-react';

const SizesManagementPage = () => {
  const { sizes, addSize } = useStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSizeName, setNewSizeName] = useState('');

  const filteredSizes = sizes.filter(size => 
    size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSize = () => {
    if (!newSizeName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do tamanho não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    if (sizes.includes(newSizeName.trim())) {
      toast({
        title: "Erro",
        description: "Este tamanho já existe",
        variant: "destructive",
      });
      return;
    }

    addSize(newSizeName.trim());
    setNewSizeName('');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Tamanho adicionado com sucesso!",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Tamanhos</h1>
          <p className="text-gray-600">Gerencie os tamanhos dos produtos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-store-blue-600 hover:bg-store-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tamanho
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Tamanho</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sizeName">Nome do Tamanho</Label>
                <Input
                  id="sizeName"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  placeholder="Ex: XXG, 54, 12"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSize()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddSize} disabled={!newSizeName.trim()}>
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar tamanhos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Tamanhos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Tamanhos Cadastrados ({filteredSizes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filteredSizes.map((size) => (
                <Badge key={size} variant="secondary" className="px-3 py-1 text-sm">
                  {size}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum tamanho encontrado' : 'Nenhum tamanho cadastrado'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SizesManagementPage;
