
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Ruler, Edit, Trash2 } from 'lucide-react';

const SizesManagementPage = () => {
  const { sizes, addSize, updateSize, removeSize } = useStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSizeName, setNewSizeName] = useState('');
  const [editingSizeIndex, setEditingSizeIndex] = useState(-1);
  const [editingSizeName, setEditingSizeName] = useState('');

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

  const handleEditSize = (index: number, currentName: string) => {
    setEditingSizeIndex(index);
    setEditingSizeName(currentName);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSize = () => {
    if (!editingSizeName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do tamanho não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    const trimmedName = editingSizeName.trim();
    const oldName = sizes[editingSizeIndex];

    if (trimmedName !== oldName && sizes.includes(trimmedName)) {
      toast({
        title: "Erro",
        description: "Este tamanho já existe",
        variant: "destructive",
      });
      return;
    }

    updateSize(editingSizeIndex, trimmedName);
    setIsEditDialogOpen(false);
    setEditingSizeIndex(-1);
    setEditingSizeName('');
    
    toast({
      title: "Sucesso",
      description: "Tamanho atualizado com sucesso!",
    });
  };

  const handleDeleteSize = (index: number, sizeName: string) => {
    removeSize(index);
    
    toast({
      title: "Sucesso",
      description: `Tamanho "${sizeName}" removido com sucesso!`,
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

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tamanho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editSizeName">Nome do Tamanho</Label>
              <Input
                id="editSizeName"
                value={editingSizeName}
                onChange={(e) => setEditingSizeName(e.target.value)}
                placeholder="Ex: XXG, 54, 12"
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateSize()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateSize} disabled={!editingSizeName.trim()}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              {filteredSizes.map((size, index) => {
                const originalIndex = sizes.indexOf(size);
                return (
                  <div key={size} className="flex items-center gap-1 bg-secondary rounded-full pl-3 pr-1 py-1">
                    <span className="text-sm font-semibold">{size}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        onClick={() => handleEditSize(originalIndex, size)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o tamanho "{size}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSize(originalIndex, size)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
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
