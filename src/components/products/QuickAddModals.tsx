
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  value: string;
  onChange: (value: string) => void;
  title: string;
  label: string;
  placeholder: string;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  value,
  onChange,
  title,
  label,
  placeholder
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newItem">{label}</Label>
            <Input
              id="newItem"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => e.key === 'Enter' && onAdd()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onAdd} disabled={!value.trim()}>
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface QuickAddModalsProps {
  categoryModal: {
    isOpen: boolean;
    value: string;
    onClose: () => void;
    onAdd: () => void;
    onChange: (value: string) => void;
  };
  collectionModal: {
    isOpen: boolean;
    value: string;
    onClose: () => void;
    onAdd: () => void;
    onChange: (value: string) => void;
  };
  brandModal: {
    isOpen: boolean;
    value: string;
    onClose: () => void;
    onAdd: () => void;
    onChange: (value: string) => void;
  };
  supplierModal: {
    isOpen: boolean;
    value: string;
    onClose: () => void;
    onAdd: () => void;
    onChange: (value: string) => void;
  };
  colorModal: {
    isOpen: boolean;
    value: string;
    onClose: () => void;
    onAdd: () => void;
    onChange: (value: string) => void;
  };
}

export const QuickAddModals: React.FC<QuickAddModalsProps> = ({
  categoryModal,
  collectionModal,
  brandModal,
  supplierModal,
  colorModal
}) => {
  return (
    <>
      <QuickAddModal
        {...categoryModal}
        title="Nova Categoria"
        label="Nome da Categoria"
        placeholder="Ex: Acessórios"
      />
      <QuickAddModal
        {...collectionModal}
        title="Nova Coleção"
        label="Nome da Coleção"
        placeholder="Ex: Outono 2024"
      />
      <QuickAddModal
        {...brandModal}
        title="Nova Marca"
        label="Nome da Marca"
        placeholder="Ex: Nike"
      />
      <QuickAddModal
        {...supplierModal}
        title="Novo Fornecedor"
        label="Nome do Fornecedor"
        placeholder="Ex: Distribuidora ABC"
      />
      <QuickAddModal
        {...colorModal}
        title="Nova Cor"
        label="Nome da Cor"
        placeholder="Ex: Azul Marinho"
      />
    </>
  );
};
