
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Users, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RolePermissions {
  role: 'admin' | 'vendedor' | 'caixa' | 'consultivo';
  can_view_products: boolean;
  can_create_products: boolean;
  can_edit_products: boolean;
  can_delete_products: boolean;
  can_view_customers: boolean;
  can_create_customers: boolean;
  can_edit_customers: boolean;
  can_delete_customers: boolean;
  can_view_sales: boolean;
  can_create_sales: boolean;
  can_edit_sales: boolean;
  can_delete_sales: boolean;
  can_view_reports: boolean;
  can_manage_users: boolean;
  can_manage_settings: boolean;
  can_import_products: boolean;
  can_export_data: boolean;
}

const RolesSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roleSettings, setRoleSettings] = useState<Record<string, RolePermissions>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Carregar configurações do Supabase
  useEffect(() => {
    fetchRoleSettings();
  }, []);

  const fetchRoleSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');

      if (error) {
        console.error('Error fetching role settings:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar configurações de perfis",
          variant: "destructive"
        });
        return;
      }

      // Converter array para objeto indexado por role
      const settingsObj = data.reduce((acc, item) => {
        acc[item.role] = item;
        return acc;
      }, {});

      setRoleSettings(settingsObj);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const roleLabels = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    caixa: 'Caixa',
    consultivo: 'Consultivo'
  };

  const permissionLabels = {
    can_create_products: 'Criar produtos',
    can_edit_products: 'Editar produtos',
    can_delete_products: 'Excluir produtos',
    can_view_products: 'Visualizar produtos',
    can_create_customers: 'Criar clientes',
    can_edit_customers: 'Editar clientes',
    can_delete_customers: 'Excluir clientes',
    can_view_customers: 'Visualizar clientes',
    can_create_sales: 'Criar vendas',
    can_edit_sales: 'Editar vendas',
    can_delete_sales: 'Excluir vendas',
    can_view_sales: 'Visualizar vendas',
    can_view_reports: 'Visualizar relatórios',
    can_manage_users: 'Gerenciar usuários',
    can_manage_settings: 'Gerenciar configurações',
    can_import_products: 'Importar produtos',
    can_export_data: 'Exportar dados'
  };

  const handlePermissionChange = (role: keyof typeof roleLabels, permission: keyof RolePermissions, value: boolean) => {
    setRoleSettings(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Atualizar cada role no Supabase
      for (const [role, permissions] of Object.entries(roleSettings)) {
        const { error } = await supabase
          .from('role_permissions')
          .update(permissions)
          .eq('role', role as 'admin' | 'vendedor' | 'caixa' | 'consultivo');

        if (error) {
          console.error(`Error updating ${role} permissions:`, error);
          toast({
            title: "Erro",
            description: `Erro ao salvar permissões do perfil ${roleLabels[role as keyof typeof roleLabels]}`,
            variant: "destructive"
          });
          return;
        }
      }

      toast({
        title: "✅ Permissões atualizadas",
        description: "As permissões dos perfis foram salvas no banco de dados.",
      });
    } catch (error) {
      console.error('Error saving role settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Perfis</h1>
            <p className="text-muted-foreground">
              Configure as permissões de cada perfil de usuário
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
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
                      checked={Boolean(roleSettings[roleKey as keyof typeof roleLabels]?.[permissionKey as keyof RolePermissions]) || false}
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
