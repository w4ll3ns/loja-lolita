
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Users, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { RolePermissions } from '@/types/store';
import { useToast } from '@/hooks/use-toast';

const RolesSettingsPage = () => {
  const navigate = useNavigate();
  const { roleSettings, updateRoleSettings } = useStore();
  const { toast } = useToast();
  
  const [localRoleSettings, setLocalRoleSettings] = useState(roleSettings);

  const roleLabels = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    caixa: 'Caixa',
    consultivo: 'Consultivo'
  };

  const permissionLabels = {
    canCreateProducts: 'Criar produtos',
    canEditProducts: 'Editar produtos',
    canDeleteProducts: 'Excluir produtos',
    canViewProducts: 'Visualizar produtos',
    canCreateCustomers: 'Criar clientes',
    canEditCustomers: 'Editar clientes',
    canDeleteCustomers: 'Excluir clientes',
    canViewCustomers: 'Visualizar clientes',
    canCreateSales: 'Criar vendas',
    canEditSales: 'Editar vendas',
    canDeleteSales: 'Excluir vendas',
    canViewSales: 'Visualizar vendas',
    canViewReports: 'Visualizar relatórios',
    canManageUsers: 'Gerenciar usuários',
    canManageSettings: 'Gerenciar configurações',
    canImportProducts: 'Importar produtos',
    canExportData: 'Exportar dados'
  };

  const handlePermissionChange = (role: keyof typeof roleLabels, permission: keyof RolePermissions, value: boolean) => {
    setLocalRoleSettings(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  const handleSave = () => {
    updateRoleSettings(localRoleSettings);
    toast({
      title: "✅ Permissões atualizadas",
      description: "As permissões dos perfis foram salvas com sucesso.",
    });
  };

  const hasChanges = JSON.stringify(localRoleSettings) !== JSON.stringify(roleSettings);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Perfis</h1>
            <p className="text-muted-foreground">
              Configure as permissões de cada perfil de usuário
            </p>
          </div>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(roleLabels).map(([roleKey, roleLabel]) => (
          <Card key={roleKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {roleLabel}
              </CardTitle>
              <CardDescription>
                Configure as permissões para o perfil {roleLabel.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(permissionLabels).map(([permissionKey, permissionLabel]) => (
                  <div key={permissionKey} className="flex items-center justify-between space-x-2">
                    <Label htmlFor={`${roleKey}-${permissionKey}`} className="text-sm font-medium">
                      {permissionLabel}
                    </Label>
                    <Switch
                      id={`${roleKey}-${permissionKey}`}
                      checked={localRoleSettings[roleKey as keyof typeof roleLabels][permissionKey as keyof RolePermissions]}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(roleKey as keyof typeof roleLabels, permissionKey as keyof RolePermissions, checked)
                      }
                      disabled={roleKey === 'admin'} // Admin sempre tem todas as permissões
                    />
                  </div>
                ))}
              </div>
              {roleKey === 'admin' && (
                <p className="text-xs text-muted-foreground mt-4">
                  * O perfil Administrador possui todas as permissões por padrão e não pode ser alterado.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesSettingsPage;
