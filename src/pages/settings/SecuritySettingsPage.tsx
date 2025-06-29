
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import { PasswordPoliciesSection } from '@/components/settings/PasswordPoliciesSection';
import { AuthenticationSection } from '@/components/settings/AuthenticationSection';
import { SessionControlSection } from '@/components/settings/SessionControlSection';
import { SecurityWarningCard } from '@/components/settings/SecurityWarningCard';

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { settings, isLoading, handleSave, updateSetting } = useSecuritySettings();

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
        <PasswordPoliciesSection 
          settings={settings} 
          onSettingChange={updateSetting} 
        />

        <AuthenticationSection 
          settings={settings} 
          onSettingChange={updateSetting} 
        />

        <SessionControlSection 
          settings={settings} 
          onSettingChange={updateSetting} 
        />

        <SecurityWarningCard />

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
