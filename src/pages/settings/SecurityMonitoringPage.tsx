import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, AlertTriangle, Eye, Trash2, RefreshCw, Bell, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const SecurityMonitoringPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    securityEvents,
    securityAlerts,
    isMonitoring,
    dismissAlert,
    clearAllEvents,
    toggleMonitoring,
    getSecurityStats,
  } = useSecurityMonitoring();

  const stats = getSecurityStats();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'failed_login':
        return 'bg-red-100 text-red-800';
      case 'suspicious_activity':
        return 'bg-orange-100 text-orange-800';
      case 'admin_action':
        return 'bg-blue-100 text-blue-800';
      case 'data_access':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  // Verificar se usuário é admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Apenas administradores podem acessar o monitoramento de segurança.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoramento de Segurança</h1>
            <p className="text-muted-foreground">
              Monitore atividades de segurança e detecte ameaças
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Logins Falhados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
              <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades Suspeitas</CardTitle>
              <Eye className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.suspiciousActivities}</div>
              <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
              <Bell className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Não descartados</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={isMonitoring ? "default" : "outline"}
              onClick={toggleMonitoring}
              className="flex items-center gap-2"
            >
              {isMonitoring ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {isMonitoring ? 'Monitoramento Ativo' : 'Monitoramento Inativo'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={clearAllEvents}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Limpar Eventos
            </Button>
          </div>
        </div>

        {/* Alertas */}
        {securityAlerts.filter(alert => !alert.dismissed).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertas de Segurança
              </CardTitle>
              <CardDescription>
                Alertas ativos que requerem atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts
                  .filter(alert => !alert.dismissed)
                  .map(alert => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getAlertLevelColor(alert.level)}>
                          {alert.level.toUpperCase()}
                        </Badge>
                        <span className="text-sm">{alert.message}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          Descartar
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eventos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Eventos Recentes
            </CardTitle>
            <CardDescription>
              Últimos eventos de segurança registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {securityEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum evento registrado
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {securityEvents
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .slice(0, 50)
                  .map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.replace('_', ' ')}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{event.details}</p>
                          {event.userEmail && (
                            <p className="text-xs text-muted-foreground">
                              {event.userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default SecurityMonitoringPage; 