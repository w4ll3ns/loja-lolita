
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Printer, MessageCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

interface SaleConfirmationProps {
  open: boolean;
  onClose: () => void;
  onNewSale: () => void;
  onBackToDashboard: () => void;
  saleTotal: number;
  customerWhatsApp?: string;
}

export const SaleConfirmation = ({ 
  open, 
  onClose, 
  onNewSale, 
  onBackToDashboard, 
  saleTotal,
  customerWhatsApp 
}: SaleConfirmationProps) => {
  
  const handlePrintReceipt = () => {
    // Implementar impressão do cupom
    console.log('Imprimindo cupom...');
  };

  const handleSendWhatsApp = () => {
    if (customerWhatsApp) {
      const message = `Obrigado pela sua compra! Valor total: R$ ${saleTotal.toFixed(2)}. Esperamos você novamente em breve! 😊`;
      const phoneNumber = customerWhatsApp.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center text-store-green-600">
            <CheckCircle className="h-6 w-6" />
            Venda Finalizada com Sucesso!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <p className="text-2xl font-bold text-store-green-600 mb-2">
            R$ {saleTotal.toFixed(2)}
          </p>
          <p className="text-muted-foreground">
            Valor total da venda
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrintReceipt}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir Cupom
          </Button>
          
          {customerWhatsApp && (
            <Button 
              variant="outline" 
              onClick={handleSendWhatsApp}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar WhatsApp
            </Button>
          )}
          
          <Button 
            onClick={onNewSale}
            className="bg-store-green-600 hover:bg-store-green-700 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Nova Venda
          </Button>
          
          <Button 
            variant="outline"
            onClick={onBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
