
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  productName: string;
  requiresPassword: boolean;
  onPasswordValidate: (password: string) => boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  requiresPassword,
  onPasswordValidate
}) => {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleConfirm = () => {
    if (requiresPassword) {
      if (!password) {
        setPasswordError('Senha é obrigatória');
        return;
      }
      
      if (!onPasswordValidate(password)) {
        setPasswordError('Senha incorreta');
        return;
      }
    }
    
    onConfirm(reason || undefined);
    handleClose();
  };

  const handleClose = () => {
    setPassword('');
    setReason('');
    setPasswordError('');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertDialogTitle>
              {requiresPassword ? 'Produto com Vendas Associadas' : 'Confirmar Exclusão'}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {requiresPassword ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ Este produto já possui vendas associadas.
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Por segurança, é necessário inserir a senha do usuário para concluir a exclusão.
                  </p>
                </div>
                <p>
                  Tem certeza que deseja excluir o produto <strong>"{productName}"</strong>?
                </p>
              </>
            ) : (
              <p>
                Tem certeza que deseja excluir o produto <strong>"{productName}"</strong>? 
                Esta ação é irreversível.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {requiresPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha do usuário *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Digite sua senha"
                className={passwordError ? 'border-red-500' : ''}
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da exclusão (opcional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo da exclusão..."
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir Produto
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
