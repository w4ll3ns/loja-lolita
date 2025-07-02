import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettings {
  min_password_length: number;
  require_numbers: boolean;
  require_special_chars: boolean;
  two_factor_auth: boolean;
  multiple_logins: boolean;
  max_sessions: number;
  session_timeout: number;
  password_expiration: number;
}

export const useSecuritySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    min_password_length: 6,
    require_numbers: true,
    require_special_chars: false,
    two_factor_auth: false,
    multiple_logins: true,
    max_sessions: 3,
    session_timeout: 480,
    password_expiration: 90
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching security settings:', error);
        return;
      }

      if (data) {
        setSettings({
          min_password_length: data.min_password_length,
          require_numbers: data.require_numbers,
          require_special_chars: data.require_special_chars,
          two_factor_auth: data.two_factor_auth,
          multiple_logins: data.multiple_logins,
          max_sessions: data.max_sessions,
          session_timeout: data.session_timeout,
          password_expiration: data.password_expiration
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validateSettings = (settings: SecuritySettings): string | null => {
    if (settings.min_password_length < 6 || settings.min_password_length > 20) {
      return "O comprimento mínimo da senha deve estar entre 6 e 20 caracteres";
    }

    if (settings.password_expiration < 30 || settings.password_expiration > 365) {
      return "A expiração da senha deve estar entre 30 e 365 dias";
    }

    if (settings.max_sessions < 1 || settings.max_sessions > 10) {
      return "O número máximo de sessões deve estar entre 1 e 10";
    }

    if (settings.session_timeout < 30 || settings.session_timeout > 1440) {
      return "O tempo limite da sessão deve estar entre 30 e 1440 minutos";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateSettings(settings);
    if (validationError) {
      toast({
        title: "Erro de validação",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verificar se já existe configuração
      const { data: existingData } = await supabase
        .from('security_settings')
        .select('id')
        .single();

      let result;
      if (existingData) {
        // Atualizar
        result = await supabase
          .from('security_settings')
          .update(settings)
          .eq('id', existingData.id);
      } else {
        // Inserir
        result = await supabase
          .from('security_settings')
          .insert(settings);
      }

      if (result.error) {
        toast({
          title: "Erro ao salvar",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "✅ Configurações salvas",
        description: "As configurações de segurança foram atualizadas no banco de dados.",
      });

      // Show warning if security settings are too permissive
      if (!settings.require_numbers && !settings.require_special_chars && settings.min_password_length < 8) {
        toast({
          title: "⚠️ Atenção: Segurança baixa",
          description: "As configurações atuais podem comprometer a segurança do sistema",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Erro interno ao salvar configurações",
        variant: "destructive",
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