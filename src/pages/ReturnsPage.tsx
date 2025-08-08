import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSales } from '@/contexts/SalesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useReturnsLogic } from '@/hooks/useReturnsLogic';
import { Return, ReturnStatus, ReturnType, ReturnReason } from '@/types/returns';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ArrowLeftRight,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateReturnModal from '@/components/returns/CreateReturnModal';
import ViewReturnModal from '@/components/returns/ViewReturnModal';

const StoreCreditsSection = () => <div>Seção de Créditos da Loja (em desenvolvimento)</div>;

const ReturnsPage = () => {
  const { sales } = useSales();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    returns,
    loading,
    loadReturns,
    approveReturn,
    rejectReturn,
    completeReturn,
    getReturnStats
  } = useReturnsLogic();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReturnType | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadReturns();
    loadStats();
  }, [loadReturns]);

  const loadStats = async () => {
    const returnStats = await getReturnStats();
    setStats(returnStats);
  };

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = 
      returnItem.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
    const matchesType = typeFilter === 'all' || returnItem.return_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: ReturnStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ReturnStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: ReturnType) => {
    switch (type) {
      case 'return': return <Package className="h-4 w-4" />;
      case 'exchange': return <ArrowLeftRight className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getReasonText = (reason: ReturnReason) => {
    switch (reason) {
      case 'defective': return 'Defeituoso';
      case 'wrong_size': return 'Tamanho errado';
      case 'wrong_color': return 'Cor errada';
      case 'not_liked': return 'Não gostou';
      case 'other': return 'Outro';
      default: return reason;
    }
  };

  const handleApprove = async (returnId: string) => {
    if (user?.name) {
      await approveReturn(returnId, user.name);
    }
  };

  const handleReject = async (returnId: string) => {
    if (user?.name) {
      await rejectReturn(returnId, user.name);
    }
  };

  const handleComplete = async (returnId: string) => {
    if (user?.name) {
      await completeReturn(returnId, user.name);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Devoluções e Trocas</h1>
            <p className="text-gray-600">Gerencie devoluções e trocas de produtos</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-store-blue-600 hover:bg-store-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Devolução
        </Button>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devoluções</CardTitle>
              <Package className="h-4 w-4 text-store-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_returns}</div>
              <p className="text-xs text-muted-foreground">
                Devoluções realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trocas</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-store-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_exchanges}</div>
              <p className="text-xs text-muted-foreground">
                Trocas realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reembolsado</CardTitle>
              <DollarSign className="h-4 w-4 text-store-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.total_refunded.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Valor total reembolsado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos da Loja</CardTitle>
              <CreditCard className="h-4 w-4 text-store-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.total_store_credits.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Créditos emitidos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="returns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="returns">Devoluções</TabsTrigger>
          <TabsTrigger value="credits">Créditos da Loja</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cliente ou ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={(value: ReturnStatus | 'all') => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                      <SelectItem value="completed">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={typeFilter} onValueChange={(value: ReturnType | 'all') => setTypeFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="return">Devolução</SelectItem>
                      <SelectItem value="exchange">Troca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      loadReturns();
                      loadStats();
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Devoluções */}
          <Card>
            <CardHeader>
              <CardTitle>Devoluções e Trocas</CardTitle>
              <CardDescription>
                {filteredReturns.length} devolução{filteredReturns.length !== 1 ? 'ões' : ''} encontrada{filteredReturns.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Carregando devoluções...</p>
                </div>
              ) : filteredReturns.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma devolução encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReturns.map((returnItem) => (
                    <Card key={returnItem.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getTypeIcon(returnItem.return_type)}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {returnItem.customer?.name || 'Cliente não encontrado'}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {returnItem.id.slice(0, 8)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {getReasonText(returnItem.return_reason)} • {returnItem.return_items?.length || 0} item{returnItem.return_items?.length !== 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(returnItem.created_at).toLocaleDateString('pt-BR')} às {new Date(returnItem.created_at).toLocaleTimeString('pt-BR')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">
                                R$ {(returnItem.refund_amount || 0).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {returnItem.refund_method === 'store_credit' ? 'Crédito da Loja' : 
                                 returnItem.refund_method === 'exchange' ? 'Troca' : 'Reembolso'}
                              </p>
                            </div>

                            <Badge className={getStatusColor(returnItem.status)}>
                              {getStatusIcon(returnItem.status)}
                              <span className="ml-1">
                                {returnItem.status === 'pending' ? 'Pendente' :
                                 returnItem.status === 'approved' ? 'Aprovado' :
                                 returnItem.status === 'rejected' ? 'Rejeitado' : 'Finalizado'}
                              </span>
                            </Badge>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedReturn(returnItem)}
                              >
                                Detalhes
                              </Button>

                              {returnItem.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApprove(returnItem.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    Aprovar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(returnItem.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Rejeitar
                                  </Button>
                                </>
                              )}

                              {returnItem.status === 'approved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleComplete(returnItem.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Finalizar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          <StoreCreditsSection />
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <CreateReturnModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        sales={sales}
        onSuccess={() => {
          setShowCreateModal(false);
          loadReturns();
          loadStats();
        }}
      />

      <ViewReturnModal
        open={!!selectedReturn}
        returnData={selectedReturn}
        onClose={() => setSelectedReturn(null)}
        onStatusChange={() => {
          loadReturns();
          loadStats();
        }}
      />
    </div>
  );
};

export default ReturnsPage; 