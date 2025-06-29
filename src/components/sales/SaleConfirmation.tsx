
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Printer, MessageCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Sale } from '@/contexts/StoreContext';

interface SaleConfirmationProps {
  open: boolean;
  onClose: () => void;
  onNewSale: () => void;
  onBackToDashboard: () => void;
  sale: Sale | null;
}

export const SaleConfirmation = ({ 
  open, 
  onClose, 
  onNewSale, 
  onBackToDashboard, 
  sale
}: SaleConfirmationProps) => {
  
  const handlePrintReceipt = () => {
    // Implementar impressão do cupom
    console.log('Imprimindo cupom...');
  };

  const handleSendWhatsApp = () => {
    if (!sale || !sale.customer.whatsapp) return;

    // Construir resumo dos itens
    const itemsText = sale.items.map(item => 
      `• ${item.product.name} - Qtd: ${item.quantity} - R$ ${item.price.toFixed(2)} = R$ ${(item.quantity * item.price).toFixed(2)}`
    ).join('\n');

    // Construir mensagem completa
    let message = `🛍️ *RESUMO DA COMPRA* 🛍️\n\n`;
    message += `📋 *ITENS:*\n${itemsText}\n\n`;
    message += `💰 *VALORES:*\n`;
    message += `Subtotal: R$ ${sale.subtotal.toFixed(2)}\n`;
    
    if (sale.discount > 0) {
      const discountType = sale.discountType === 'percentage' ? '%' : 'R$';
      message += `Desconto: -R$ ${sale.discount.toFixed(2)}\n`;
    }
    
    message += `*TOTAL: R$ ${sale.total.toFixed(2)}*\n\n`;
    message += `💳 Pagamento: ${sale.paymentMethod.toUpperCase()}\n`;
    message += `👤 Vendedor: ${sale.seller}\n\n`;
    message += `🙏 Obrigado pela sua compra!\n`;
    message += `Esperamos você novamente em breve! 😊\n\n`;
    message += `📅 ${sale.date.toLocaleDateString('pt-BR')} às ${sale.date.toLocaleTimeString('pt-BR')}`;

    const phoneNumber = sale.customer.whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!sale) return null;

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
            R$ {sale.total.toFixed(2)}
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
          
          {sale.customer.whatsapp && !sale.customer.isGeneric && (
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
