import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';

const ColorsManagementPage = () => {
  const { colors, addColor, updateColor, deleteColor } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const filteredColors = colors.filter(color =>
    color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newColorName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da cor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (colors.includes(newColorName.trim())) {
      toast({
        title: "Erro",
        description: "Esta cor já existe",
        variant: "destructive",
      });
      return;
    }

    addColor(newColorName.trim());
    setNewColorName('');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Cor adicionada com sucesso!",
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewColorName(colors[index]);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!newColorName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da cor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const trimmedName = newColorName.trim();
    const oldName = colors[editingIndex!];

    if (trimmedName !== oldName && colors.includes(trimmedName)) {
      toast({
        title: "Erro",
        description: "Esta cor já existe",
        variant: "destructive",
      });
      return;
    }

    updateColor(oldName, trimmedName);
    setIsEditDialogOpen(false);
    setEditingIndex(null);
    setNewColorName('');
    
    toast({
      title: "Sucesso",
      description: "Cor atualizada com sucesso!",
    });
  };

  const handleDelete = (colorName: string) => {
    deleteColor(colorName);
    
    toast({
      title: "Sucesso",
      description: `Cor "${colorName}" removida com sucesso!`,
    });
  };

  const canEdit = user?.role === 'admin';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cores</h1>
          <p className="text-gray-600">Gerencie as cores dos produtos</p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-store-blue-600 hover:bg-store-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cor
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar cores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cores Cadastradas ({filteredColors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                {canEdit && <TableHead className="w-32">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredColors.map((color, index) => {
                const originalIndex = colors.indexOf(color);
                return (
                  <TableRow key={color}>
                    <TableCell className="font-medium">{color}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(originalIndex)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a cor "{color}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(color)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredColors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhuma cor encontrada' : 'Nenhuma cor cadastrada'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Cor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome da cor"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd} className="bg-store-blue-600 hover:bg-store-blue-700">
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome da cor"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="bg-store-blue-600 hover:bg-store-blue-700">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColorsManagementPage;
