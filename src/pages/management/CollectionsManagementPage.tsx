
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

const CollectionsManagementPage = () => {
  const { collections, addCollection, updateCollection, removeCollection } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const filteredCollections = collections.filter(collection =>
    collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da coleção é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (collections.includes(newCollectionName.trim())) {
      toast({
        title: "Erro",
        description: "Esta coleção já existe",
        variant: "destructive",
      });
      return;
    }

    addCollection(newCollectionName.trim());
    setNewCollectionName('');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Coleção adicionada com sucesso!",
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewCollectionName(collections[index]);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da coleção é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const trimmedName = newCollectionName.trim();
    const oldName = collections[editingIndex!];

    if (trimmedName !== oldName && collections.includes(trimmedName)) {
      toast({
        title: "Erro",
        description: "Esta coleção já existe",
        variant: "destructive",
      });
      return;
    }

    updateCollection(editingIndex!, trimmedName);
    setIsEditDialogOpen(false);
    setEditingIndex(null);
    setNewCollectionName('');
    
    toast({
      title: "Sucesso",
      description: "Coleção atualizada com sucesso!",
    });
  };

  const handleDelete = (index: number, collectionName: string) => {
    removeCollection(index);
    
    toast({
      title: "Sucesso",
      description: `Coleção "${collectionName}" removida com sucesso!`,
    });
  };

  const canEdit = user?.role === 'admin';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coleções</h1>
          <p className="text-gray-600">Gerencie as coleções de produtos</p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-store-blue-600 hover:bg-store-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Coleção
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar coleções..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coleções Cadastradas ({filteredCollections.length})</CardTitle>
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
              {filteredCollections.map((collection, index) => {
                const originalIndex = collections.indexOf(collection);
                return (
                  <TableRow key={collection}>
                    <TableCell className="font-medium">{collection}</TableCell>
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
                                  Tem certeza que deseja excluir a coleção "{collection}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(originalIndex, collection)}
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

          {filteredCollections.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhuma coleção encontrada' : 'Nenhuma coleção cadastrada'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coleção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome da coleção"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
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
            <DialogTitle>Editar Coleção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome da coleção"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
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

export default CollectionsManagementPage;
