
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { SecuritySettings } from '@/types/store';

export const useSecuritySettings = () => {
  const { securitySettings, updateSecuritySettings } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(securitySettings);

  const validateSettings = (settings: SecuritySettings): string | null => {
    if (settings.minPasswordLength < 6 || settings.minPasswordLength > 20) {
      return "O comprimento mínimo da senha deve estar entre 6 e 20 caracteres";
    }

    if (settings.passwordExpiration < 30 || settings.passwordExpiration > 365) {
      return "A expiração da senha deve estar entre 30 e 365 dias";
    }

    if (settings.sessionTimeout < 15 || settings.sessionTimeout > 1440) {
      return "O timeout da sessão deve estar entre 15 e 1440 minutos";
    }

    if (settings.multipleLogins && settings.maxSessions < 1) {
      return "O número máximo de sessões deve ser pelo menos 1";
    }

    return null;
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const validationError = validateSettings(settings);
      if (validationError) {
        toast({
          title: "Erro de validação",
          description: validationError,
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

  const updateSetting = (key: keyof SecuritySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    isLoading,
    handleSave,
    updateSetting
  };
};
