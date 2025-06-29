
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Shield, Lock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { securitySettings, updateSecuritySettings } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(securitySettings);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validations
      if (settings.minPasswordLength < 6 || settings.minPasswordLength > 20) {
        toast({
          title: "Erro de validação",
          description: "O comprimento mínimo da senha deve estar entre 6 e 20 caracteres",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (settings.passwordExpiration < 30 || settings.passwordExpiration > 365) {
        toast({
          title: "Erro de validação",
          description: "A expiração da senha deve estar entre 30 e 365 dias",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (settings.sessionTimeout < 15 || settings.sessionTimeout > 1440) {
        toast({
          title: "Erro de validação",
          description: "O timeout da sessão deve estar entre 15 e 1440 minutos",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (settings.multipleLogins && settings.maxSessions < 1) {
        toast({
          title: "Erro de validação",
          description: "O número máximo de sessões deve ser pelo menos 1",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateSecuritySettings(settings);
      
      toast({
        title: "✅ Configurações salvas",
        description: "As configurações de segurança foram atualizadas com sucesso",
      });

      // Show warning if security settings are too permissive
      if (!settings.requireNumbers && !settings.requireSpecialChars && settings.minPasswordLength < 8) {
        toast({
          title: "⚠️ Atenção: Segurança baixa",
          description: "As configurações atuais podem comprometer a segurança do sistema",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Segurança</h1>
          <p className="text-muted-foreground">
            Configure políticas de segurança e autenticação
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Políticas de Senha
            </CardTitle>
            <CardDescription>
              Configure as regras para criação e uso de senhas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPasswordLength">Mínimo de caracteres</Label>
                <Input
                  id="minPasswordLength"
                  type="number"
                  value={settings.minPasswordLength}
                  onChange={(e) => updateSetting('minPasswordLength', parseInt(e.target.value) || 6)}
                  min="6"
                  max="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiration">Expiração (dias)</Label>
                <Input
                  id="passwordExpiration"
                  type="number"
                  value={settings.passwordExpiration}
                  onChange={(e) => updateSetting('passwordExpiration', parseInt(e.target.value) || 90)}
                  min="30"
                  max="365"
                  placeholder="90"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireNumbers">Exigir números</Label>
                  <p className="text-sm text-muted-foreground">
                    Senha deve conter pelo menos um número
                  </p>
                </div>
                <Switch 
                  id="requireNumbers"
                  checked={settings.requireNumbers}
                  onCheckedChange={(checked) => updateSetting('requireNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireSpecialChars">Exigir caracteres especiais</Label>
                  <p className="text-sm text-muted-foreground">
                    Senha deve conter símbolos (!@#$%...)
                  </p>
                </div>
                <Switch 
                  id="requireSpecialChars"
                  checked={settings.requireSpecialChars}
                  onCheckedChange={(checked) => updateSetting('requireSpecialChars', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Autenticação
            </CardTitle>
            <CardDescription>
              Configure métodos de autenticação e segurança adicional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorAuth">Autenticação em dois fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir verificação adicional no login
                </p>
              </div>
              <Switch 
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout de sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 480)}
                min="15"
                max="1440"
                placeholder="480"
              />
              <p className="text-xs text-muted-foreground">
                Usuário será deslogado automaticamente após este tempo de inatividade
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Controle de Sessões
            </CardTitle>
            <CardDescription>
              Configure o acesso simultâneo de usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="multipleLogins">Permitir múltiplos acessos</Label>
                <p className="text-sm text-muted-foreground">
                  Mesmo usuário pode estar logado em vários dispositivos
                </p>
              </div>
              <Switch 
                id="multipleLogins"
                checked={settings.multipleLogins}
                onCheckedChange={(checked) => updateSetting('multipleLogins', checked)}
              />
            </div>

            {settings.multipleLogins && (
              <div className="space-y-2">
                <Label htmlFor="maxSessions">Máximo de sessões simultâneas</Label>
                <Select 
                  value={settings.maxSessions.toString()} 
                  onValueChange={(value) => updateSetting('maxSessions', value === 'unlimited' ? 999 : parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="unlimited">Ilimitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800">
                  Atenção: Configurações de Segurança
                </p>
                <p className="text-sm text-yellow-700">
                  Alterações nas políticas de segurança serão aplicadas no próximo login dos usuários. 
                  Certifique-se de comunicar as mudanças para toda a equipe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
