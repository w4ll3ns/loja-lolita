
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, UserPlus, Edit, Shield, RotateCcw, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { User } from '@/types/store';
import { useToast } from '@/hooks/use-toast';

const UsersSettingsPage = () => {
  const navigate = useNavigate();
  const { users, addUser, updateUser, deleteUser, resetUserPassword } = useStore();
  const { toast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    newPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      vendedor: 'Vendedor',
      caixa: 'Caixa',
      consultivo: 'Consultivo'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants = {
      admin: 'destructive',
      vendedor: 'default',
      caixa: 'secondary',
      consultivo: 'outline'
    };
    return variants[role as keyof typeof variants] || 'default';
  };

  const validateUserForm = (userData: any, isEdit = false) => {
    const newErrors: Record<string, string> = {};

    if (!userData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!userData.role) {
      newErrors.role = 'Função é obrigatória';
    }

    if (!isEdit && !userData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isEdit && userData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (isEdit && userData.newPassword && userData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = () => {
    if (!validateUserForm(newUser)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados em vermelho.",
        variant: "destructive",
      });
      return;
    }

    try {
      addUser({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role as any,
        active: true
      });

      toast({
        title: "✅ Usuário criado com sucesso",
        description: `${newUser.name} foi adicionado ao sistema.`,
      });

      setIsCreateModalOpen(false);
      setNewUser({ name: '', email: '', phone: '', role: '', password: '' });
      setErrors({});
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      newPassword: ''
    });
    setIsEditModalOpen(true);
    setErrors({});
  };

  const handleSaveEditUser = () => {
    if (!validateUserForm(editUserData, true)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados em vermelho.",
        variant: "destructive",
      });
      return;
    }

    if (!editingUser) return;

    try {
      updateUser(editingUser.id, {
        name: editUserData.name,
        email: editUserData.email,
        phone: editUserData.phone,
        role: editUserData.role as any
      });

      toast({
        title: "✅ Usuário atualizado com sucesso",
        description: `As informações de ${editUserData.name} foram atualizadas.`,
      });

      setIsEditModalOpen(false);
      setEditingUser(null);
      setEditUserData({ name: '', email: '', phone: '', role: '', newPassword: '' });
      setErrors({});
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = (user: User) => {
    try {
      updateUser(user.id, { active: !user.active });
      
      toast({
        title: "✅ Status atualizado com sucesso",
        description: `${user.name} foi ${!user.active ? 'ativado' : 'desativado'}.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleOpenResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPassword = () => {
    if (!resetPasswordUser) return;

    try {
      const tempPassword = resetUserPassword(resetPasswordUser.id);
      
      toast({
        title: "✅ Senha redefinida com sucesso",
        description: `Nova senha temporária: ${tempPassword}`,
      });

      setIsResetPasswordModalOpen(false);
      setResetPasswordUser(null);
    } catch (error) {
      toast({
        title: "Erro ao redefinir senha",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários e suas permissões no sistema
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários do Sistema ({users.length})
          </CardTitle>
          <CardDescription>
            Lista de todos os usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{user.name}</h3>
                    <Badge variant={getRoleBadgeVariant(user.role) as any}>
                      {getRoleLabel(user.role)}
                    </Badge>
                    {!user.active && <Badge variant="outline">Inativo</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${user.id}`} className="text-sm">Ativo</Label>
                    <Switch 
                      id={`active-${user.id}`} 
                      checked={user.active}
                      onCheckedChange={() => handleToggleUserStatus(user)}
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenResetPassword(user)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação de Usuário */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nome Completo *</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome completo"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">E-mail *</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPhone">Telefone</Label>
              <Input
                id="userPhone"
                value={newUser.phone}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Função *</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="consultivo">Consultivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPassword">Senha Temporária *</Label>
              <Input
                id="userPassword"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Digite uma senha temporária"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} className="flex-1">
                Criar Usuário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Usuário */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editUserName">Nome Completo *</Label>
              <Input
                id="editUserName"
                value={editUserData.name}
                onChange={(e) => setEditUserData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome completo"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="editUserEmail">E-mail *</Label>
              <Input
                id="editUserEmail"
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="editUserPhone">Telefone</Label>
              <Input
                id="editUserPhone"
                value={editUserData.phone}
                onChange={(e) => setEditUserData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editUserRole">Função *</Label>
              <Select 
                value={editUserData.role} 
                onValueChange={(value) => setEditUserData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="consultivo">Consultivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="editUserNewPassword">Nova Senha (opcional)</Label>
              <Input
                id="editUserNewPassword"
                type="password"
                value={editUserData.newPassword}
                onChange={(e) => setEditUserData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Digite uma nova senha"
                className={errors.newPassword ? 'border-red-500' : ''}
              />
              {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSaveEditUser} className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Reset de Senha */}
      <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Redefinir Senha
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deseja redefinir a senha para <strong>{resetPasswordUser?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              Uma nova senha temporária será gerada e exibida para você.
            </p>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsResetPasswordModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleResetPassword} className="flex-1">
                Redefinir Senha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersSettingsPage;
