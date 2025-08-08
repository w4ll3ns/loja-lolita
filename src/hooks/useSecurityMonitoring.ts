import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'admin_action';
  userId?: string;
  userEmail?: string;
  details: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
}

interface SecurityAlert {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  dismissed: boolean;
}

const SECURITY_CONFIG = {
  maxFailedLogins: 5,
  suspiciousActivityThreshold: 10,
  alertRetentionHours: 24,
  monitoringEnabled: true,
};

// Hook temporariamente desabilitado para resolver dependência circular
export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(SECURITY_CONFIG.monitoringEnabled);
  // const { user } = useAuth();
  const { toast } = useToast();

  // Carregar eventos salvos do localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('security_events');
    const savedAlerts = localStorage.getItem('security_alerts');
    
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      // Filtrar eventos antigos (mais de 24 horas)
      const recentEvents = events.filter((event: SecurityEvent) => 
        Date.now() - event.timestamp < SECURITY_CONFIG.alertRetentionHours * 60 * 60 * 1000
      );
      setSecurityEvents(recentEvents);
    }
    
    if (savedAlerts) {
      const alerts = JSON.parse(savedAlerts);
      const recentAlerts = alerts.filter((alert: SecurityAlert) => 
        Date.now() - alert.timestamp < SECURITY_CONFIG.alertRetentionHours * 60 * 60 * 1000
      );
      setSecurityAlerts(recentAlerts);
    }
  }, []);

  // Salvar eventos no localStorage
  const saveEvents = useCallback((events: SecurityEvent[]) => {
    setSecurityEvents(events);
    localStorage.setItem('security_events', JSON.stringify(events));
  }, []);

  // Salvar alertas no localStorage
  const saveAlerts = useCallback((alerts: SecurityAlert[]) => {
    setSecurityAlerts(alerts);
    localStorage.setItem('security_alerts', JSON.stringify(alerts));
  }, []);

  // Registrar evento de segurança
  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    if (!isMonitoring) return;

    const securityEvent: SecurityEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: Date.now(),
      ipAddress: 'local', // Em produção, obter IP real
      userAgent: navigator.userAgent,
    };

    const updatedEvents = [...securityEvents, securityEvent];
    saveEvents(updatedEvents);

    // Verificar se deve gerar alerta
    checkForSecurityAlerts(updatedEvents);
  }, [securityEvents, isMonitoring, saveEvents]);

  // Verificar se deve gerar alertas
  const checkForSecurityAlerts = useCallback((events: SecurityEvent[]) => {
    const recentEvents = events.filter(event => 
      Date.now() - event.timestamp < 60 * 60 * 1000 // Última hora
    );

    // Verificar tentativas de login falhadas
    const failedLogins = recentEvents.filter(event => event.type === 'failed_login');
    if (failedLogins.length >= SECURITY_CONFIG.maxFailedLogins) {
      createSecurityAlert('high', `Múltiplas tentativas de login falhadas: ${failedLogins.length}`);
    }

    // Verificar atividades suspeitas
    const suspiciousEvents = recentEvents.filter(event => 
      event.type === 'suspicious_activity'
    );
    if (suspiciousEvents.length >= SECURITY_CONFIG.suspiciousActivityThreshold) {
      createSecurityAlert('critical', `Atividade suspeita detectada: ${suspiciousEvents.length} eventos`);
    }

    // Verificar ações de admin (temporariamente desabilitado)
    // const adminActions = recentEvents.filter(event => 
    //   event.type === 'admin_action' && event.userId !== user?.id
    // );
    // if (adminActions.length > 0) {
    //   createSecurityAlert('medium', `Ações administrativas detectadas: ${adminActions.length} ações`);
    // }
  }, []);

  // Criar alerta de segurança
  const createSecurityAlert = useCallback((level: SecurityAlert['level'], message: string) => {
    const alert: SecurityAlert = {
      id: Date.now().toString(),
      level,
      message,
      timestamp: Date.now(),
      dismissed: false,
    };

    const updatedAlerts = [...securityAlerts, alert];
    saveAlerts(updatedAlerts);

    // Mostrar toast para alertas críticos
    if (level === 'critical' || level === 'high') {
      toast({
        title: `🚨 Alerta de Segurança - ${level.toUpperCase()}`,
        description: message,
        variant: 'destructive',
      });
    }
  }, [securityAlerts, saveAlerts, toast]);

  // Registrar tentativa de login
  const logLoginAttempt = useCallback((success: boolean, email: string, details?: string) => {
    logSecurityEvent({
      type: success ? 'login_attempt' : 'failed_login',
      userEmail: email,
      details: details || (success ? 'Login bem-sucedido' : 'Login falhou'),
    });
  }, [logSecurityEvent]);

  // Registrar atividade suspeita
  const logSuspiciousActivity = useCallback((details: string, userId?: string) => {
    logSecurityEvent({
      type: 'suspicious_activity',
      userId,
      details,
    });
  }, [logSecurityEvent]);

  // Registrar acesso a dados sensíveis
  const logDataAccess = useCallback((dataType: string, action: string, userId?: string) => {
    logSecurityEvent({
      type: 'data_access',
      userId,
      details: `${action} em ${dataType}`,
    });
  }, [logSecurityEvent]);

  // Registrar ação administrativa
  const logAdminAction = useCallback((action: string, details?: string) => {
    logSecurityEvent({
      type: 'admin_action',
      userId: 'temp', // Temporariamente fixo
      userEmail: 'temp@example.com', // Temporariamente fixo
      details: `${action}${details ? `: ${details}` : ''}`,
    });
  }, [logSecurityEvent]);

  // Descartar alerta
  const dismissAlert = useCallback((alertId: string) => {
    const updatedAlerts = securityAlerts.map(alert =>
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    );
    saveAlerts(updatedAlerts);
  }, [securityAlerts, saveAlerts]);

  // Limpar eventos antigos
  const cleanupOldEvents = useCallback(() => {
    const cutoffTime = Date.now() - SECURITY_CONFIG.alertRetentionHours * 60 * 60 * 1000;
    const recentEvents = securityEvents.filter(event => event.timestamp > cutoffTime);
    const recentAlerts = securityAlerts.filter(alert => alert.timestamp > cutoffTime);
    
    saveEvents(recentEvents);
    saveAlerts(recentAlerts);
  }, [securityEvents, securityAlerts, saveEvents, saveAlerts]);

  // Limpar eventos e alertas
  const clearAllEvents = useCallback(() => {
    saveEvents([]);
    saveAlerts([]);
  }, [saveEvents, saveAlerts]);

  // Obter estatísticas de segurança
  const getSecurityStats = useCallback(() => {
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const recentEvents = securityEvents.filter(event => event.timestamp > last24Hours);
    
    return {
      totalEvents: recentEvents.length,
      failedLogins: recentEvents.filter(e => e.type === 'failed_login').length,
      suspiciousActivities: recentEvents.filter(e => e.type === 'suspicious_activity').length,
      adminActions: recentEvents.filter(e => e.type === 'admin_action').length,
      activeAlerts: securityAlerts.filter(a => !a.dismissed).length,
    };
  }, [securityEvents, securityAlerts]);

  // Alternar monitoramento
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(!isMonitoring);
  }, [isMonitoring]);

  // Limpar eventos antigos periodicamente
  useEffect(() => {
    const interval = setInterval(cleanupOldEvents, 60 * 60 * 1000); // A cada hora
    return () => clearInterval(interval);
  }, [cleanupOldEvents]);

  return {
    // Estado
    securityEvents,
    securityAlerts,
    isMonitoring,
    
    // Ações
    logLoginAttempt,
    logSuspiciousActivity,
    logDataAccess,
    logAdminAction,
    dismissAlert,
    clearAllEvents,
    toggleMonitoring,
    
    // Utilitários
    getSecurityStats,
    cleanupOldEvents,
  };
}; 