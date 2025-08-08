import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  ArrowLeftRight, 
  User, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Return, ReturnItem, ExchangeItem } from '@/types/returns';

interface ViewReturnModalProps {
  open: boolean;
  onClose: () => void;
  returnData: Return | null;
  onStatusChange?: (returnId: string, newStatus: string) => void;
}

const ViewReturnModal = ({ open, onClose, returnData, onStatusChange }: ViewReturnModalProps) => {
  if (!returnData) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getReturnTypeText = (type: string) => {
    return type === 'return' ? 'Devolução' : 'Troca';
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'defective': return 'Defeituoso';
      case 'wrong_size': return 'Tamanho errado';
      case 'wrong_color': return 'Cor errada';
      case 'not_liked': return 'Não gostou';
      case 'other': return 'Outro';
      default: return reason;
    }
  };

  const getRefundMethodText = (method: string) => {
    switch (method) {
      case 'same_payment': return 'Mesmo método de pagamento';
      case 'store_credit': return 'Crédito da loja';
      case 'exchange': return 'Troca';
      default: return method;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(returnData.id, newStatus);
    }
  };

  const canChangeStatus = returnData.status === 'pending';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {returnData.return_type === 'return' ? <Package className="h-5 w-5" /> : <ArrowLeftRight className="h-5 w-5" />}
            {getReturnTypeText(returnData.return_type)} #{returnData.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Status</span>
                <Badge className={`${getStatusColor(returnData.status)} flex items-center gap-1`}>
                  {getStatusIcon(returnData.status)}
                  {getStatusText(returnData.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-semibold">{returnData.customer?.name || 'Cliente não encontrado'}</p>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-semibold">
                        {new Date(returnData.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">Data de Criação</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-semibold">R$ {(returnData.refund_amount || 0).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total a Reembolsar</p>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Devolução */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Motivo</Label>
                    <p className="text-sm text-muted-foreground">
                      {getReasonText(returnData.return_reason)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Método de Reembolso</Label>
                    <p className="text-sm text-muted-foreground">
                      {getRefundMethodText(returnData.refund_method)}
                    </p>
                  </div>
                </div>

                {returnData.notes && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Observações
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {returnData.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Itens da Devolução */}
          <Card>
            <CardHeader>
              <CardTitle>Itens da {getReturnTypeText(returnData.return_type)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnData.return_items?.map((item: ReturnItem) => (
                  <Card key={item.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product?.name || 'Produto não encontrado'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity} • Preço Original: R$ {item.original_price.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Preço de Reembolso: R$ {item.refund_price.toFixed(2)}
                          </p>
                          {item.product?.barcode && (
                            <p className="text-xs text-muted-foreground font-mono">
                              Código: {item.product.barcode}
                            </p>
                          )}
                          {item.condition_description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <strong>Condição:</strong> {item.condition_description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {(item.refund_price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Itens de Troca (se aplicável) */}
          {returnData.return_type === 'exchange' && returnData.exchange_items && returnData.exchange_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Itens de Troca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returnData.exchange_items?.map((item: ExchangeItem) => (
                    <Card key={item.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-muted-foreground">De:</span>
                              <span className="font-semibold">{item.original_product?.name || 'Produto não encontrado'}</span>
                              {item.original_product?.barcode && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  ({item.original_product.barcode})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Para:</span>
                              <span className="font-semibold">{item.new_product?.name || 'Produto não encontrado'}</span>
                              {item.new_product?.barcode && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  ({item.new_product.barcode})
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Quantidade: {item.quantity} • Diferença: R$ {item.price_difference.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}



          {/* Ações */}
          {canChangeStatus && onStatusChange && (
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusChange('approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('rejected')}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botão Fechar */}
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReturnModal; 