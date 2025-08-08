import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Product, SaleItem } from '@/types/store';

interface InventorySettings {
  allowNegativeStock: boolean;
  showStockWarnings: boolean;
  lowStockThreshold: number;
  requireStockConfirmation: boolean;
}

const DEFAULT_INVENTORY_SETTINGS: InventorySettings = {
  allowNegativeStock: true, // Permitir estoque negativo com aviso
  showStockWarnings: true,
  lowStockThreshold: 3, // Avisar quando estoque < 3
  requireStockConfirmation: true, // Confirmar quando estoque < 1
};

export const useInventoryControl = () => {
  const { toast } = useToast();
  const [settings] = useState<InventorySettings>(DEFAULT_INVENTORY_SETTINGS);

  // Calcular estoque real (considerando negative_stock)
  const getRealStock = useCallback((product: Product): number => {
    const baseStock = product.quantity || 0;
    const negativeStock = product.negative_stock || 0;
    return baseStock - negativeStock;
  }, []);

  // Verificar se produto pode ser adicionado
  const canAddProduct = useCallback((product: Product, currentQuantity: number, requestedQuantity: number = 1): {
    allowed: boolean;
    reason?: string;
    warning?: string;
    requiresConfirmation: boolean;
  } => {
    // Produtos temporários sempre podem ser adicionados
    if (product.category === 'Temporário') {
      return {
        allowed: true,
        requiresConfirmation: false
      };
    }

    const newTotalQuantity = currentQuantity + requestedQuantity;
    const realStock = getRealStock(product);

    // Se não há estoque disponível
    if (realStock <= 0) {
      if (settings.allowNegativeStock) {
        return {
          allowed: true,
          warning: `⚠️ Produto sem estoque! Estoque atual: ${realStock}`,
          requiresConfirmation: true
        };
      } else {
        return {
          allowed: false,
          reason: 'Produto sem estoque disponível',
          requiresConfirmation: false
        };
      }
    }

    // Se a quantidade solicitada excede o estoque
    if (newTotalQuantity > realStock) {
      if (settings.allowNegativeStock) {
        const negativeAmount = newTotalQuantity - realStock;
        return {
          allowed: true,
          warning: `⚠️ Estoque insuficiente! Será negativo em ${negativeAmount} unidades`,
          requiresConfirmation: true
        };
      } else {
        return {
          allowed: false,
          reason: `Estoque insuficiente. Disponível: ${realStock}, Solicitado: ${newTotalQuantity}`,
          requiresConfirmation: false
        };
      }
    }

    // Se está próximo do estoque baixo
    if (realStock <= settings.lowStockThreshold) {
      return {
        allowed: true,
        warning: `⚠️ Estoque baixo! Apenas ${realStock} unidades disponíveis`,
        requiresConfirmation: realStock <= 1
      };
    }

    return {
      allowed: true,
      requiresConfirmation: false
    };
  }, [settings, getRealStock]);

  // Verificar se quantidade pode ser atualizada
  const canUpdateQuantity = useCallback((product: Product, newQuantity: number): {
    allowed: boolean;
    reason?: string;
    warning?: string;
    requiresConfirmation: boolean;
  } => {
    // Produtos temporários sempre podem ser atualizados
    if (product.category === 'Temporário') {
      return {
        allowed: true,
        requiresConfirmation: false
      };
    }

    const realStock = getRealStock(product);

    // Se não há estoque disponível
    if (realStock <= 0) {
      if (settings.allowNegativeStock) {
        return {
          allowed: true,
          warning: `⚠️ Produto sem estoque! Estoque atual: ${realStock}`,
          requiresConfirmation: true
        };
      } else {
        return {
          allowed: false,
          reason: 'Produto sem estoque disponível',
          requiresConfirmation: false
        };
      }
    }

    // Se a nova quantidade excede o estoque
    if (newQuantity > realStock) {
      if (settings.allowNegativeStock) {
        const negativeAmount = newQuantity - realStock;
        return {
          allowed: true,
          warning: `⚠️ Estoque insuficiente! Será negativo em ${negativeAmount} unidades`,
          requiresConfirmation: true
        };
      } else {
        return {
          allowed: false,
          reason: `Estoque insuficiente. Disponível: ${realStock}, Solicitado: ${newQuantity}`,
          requiresConfirmation: false
        };
      }
    }

    // Se está próximo do estoque baixo
    if (realStock <= settings.lowStockThreshold) {
      return {
        allowed: true,
        warning: `⚠️ Estoque baixo! Apenas ${realStock} unidades disponíveis`,
        requiresConfirmation: realStock <= 1
      };
    }

    return {
      allowed: true,
      requiresConfirmation: false
    };
  }, [settings, getRealStock]);

  // Calcular estoque disponível considerando itens já no carrinho
  const getAvailableStock = useCallback((product: Product, selectedItems: SaleItem[]): number => {
    const currentInCart = selectedItems
      .filter(item => item.product.id === product.id)
      .reduce((total, item) => total + item.quantity, 0);
    
    const realStock = getRealStock(product);
    return Math.max(0, realStock - currentInCart);
  }, [getRealStock]);

  // Verificar se venda pode ser finalizada
  const canFinalizeSale = useCallback((selectedItems: SaleItem[]): {
    allowed: boolean;
    issues: string[];
    warnings: string[];
  } => {
    const issues: string[] = [];
    const warnings: string[] = [];

    selectedItems.forEach(item => {
      const product = item.product;
      
      // Pular produtos temporários
      if (product.category === 'Temporário') return;

      const realStock = getRealStock(product);
      const requestedQuantity = item.quantity;

      if (realStock < requestedQuantity) {
        if (settings.allowNegativeStock) {
          const negativeAmount = requestedQuantity - realStock;
          warnings.push(`${product.name}: Estoque negativo em ${negativeAmount} unidades`);
        } else {
          issues.push(`${product.name}: Estoque insuficiente (${realStock} disponível, ${requestedQuantity} solicitado)`);
        }
      } else if (realStock <= settings.lowStockThreshold) {
        warnings.push(`${product.name}: Estoque baixo (${realStock} unidades)`);
      }
    });

    return {
      allowed: issues.length === 0,
      issues,
      warnings
    };
  }, [settings, getRealStock]);

  // Mostrar avisos de estoque
  const showStockWarnings = useCallback((warnings: string[]) => {
    if (warnings.length > 0 && settings.showStockWarnings) {
      toast({
        title: "⚠️ Avisos de Estoque",
        description: warnings.join('\n'),
        variant: "destructive",
      });
    }
  }, [settings, toast]);

  // Mostrar erros de estoque
  const showStockErrors = useCallback((issues: string[]) => {
    if (issues.length > 0) {
      toast({
        title: "❌ Problemas de Estoque",
        description: issues.join('\n'),
        variant: "destructive",
      });
    }
  }, [toast]);

  // Atualizar estoque após venda (REAL - no banco de dados)
  const updateStockAfterSale = useCallback(async (items: SaleItem[]) => {
    try {
      console.log('🔄 Atualizando estoque após venda...');
      
      for (const item of items) {
        const product = item.product;
        
        // Pular produtos temporários
        if (product.category === 'Temporário') {
          console.log(`⏭️ Pulando produto temporário: ${product.name}`);
          continue;
        }

        const currentStock = product.quantity || 0;
        const currentNegativeStock = product.negative_stock || 0;
        const soldQuantity = item.quantity;
        
        // Calcular novo estoque
        const newStock = currentStock - soldQuantity;
        let newNegativeStock = currentNegativeStock;
        
        // Se ficou negativo, ajustar
        if (newStock < 0) {
          newNegativeStock = currentNegativeStock + Math.abs(newStock);
          const finalStock = 0; // Manter quantity >= 0
          
          console.log(`📦 ${product.name}: ${currentStock} → ${finalStock} (vendidos: ${soldQuantity}, negativo: ${newNegativeStock})`);

          // Atualizar estoque no banco
          const { error } = await supabase
            .from('products')
            .update({ 
              quantity: finalStock,
              negative_stock: newNegativeStock,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id);

          if (error) {
            console.error(`❌ Erro ao atualizar estoque de ${product.name}:`, error);
            toast({
              title: "Erro ao atualizar estoque",
              description: `Não foi possível atualizar o estoque de ${product.name}`,
              variant: "destructive",
            });
          } else {
            console.log(`✅ Estoque atualizado: ${product.name} → ${finalStock} (negativo: ${newNegativeStock})`);
            
            // Criar alerta se estoque ficou baixo ou negativo
            if (newNegativeStock > 0) {
              const { error: alertError } = await supabase
                .from('stock_alerts')
                .insert({
                  product_id: product.id,
                  product_name: product.name,
                  current_stock: -newNegativeStock,
                  alert_type: 'negative_stock'
                });

              if (alertError) {
                console.error(`❌ Erro ao criar alerta para ${product.name}:`, alertError);
              } else {
                console.log(`⚠️ Alerta criado: ${product.name} (negativo: ${newNegativeStock} unidades)`);
              }
            }
          }
        } else {
          console.log(`📦 ${product.name}: ${currentStock} → ${newStock} (vendidos: ${soldQuantity})`);

          // Atualizar estoque no banco
          const { error } = await supabase
            .from('products')
            .update({ 
              quantity: newStock,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id);

          if (error) {
            console.error(`❌ Erro ao atualizar estoque de ${product.name}:`, error);
            toast({
              title: "Erro ao atualizar estoque",
              description: `Não foi possível atualizar o estoque de ${product.name}`,
              variant: "destructive",
            });
          } else {
            console.log(`✅ Estoque atualizado: ${product.name} → ${newStock}`);
            
            // Criar alerta se estoque ficou baixo
            if (newStock <= 3 && newStock >= 0) {
              const { error: alertError } = await supabase
                .from('stock_alerts')
                .insert({
                  product_id: product.id,
                  product_name: product.name,
                  current_stock: newStock,
                  alert_type: 'low_stock'
                });

              if (alertError) {
                console.error(`❌ Erro ao criar alerta para ${product.name}:`, alertError);
              } else {
                console.log(`⚠️ Alerta criado: ${product.name} (${newStock} unidades)`);
              }
            }
          }
        }
      }

      toast({
        title: "Estoque Atualizado",
        description: "O estoque foi atualizado após a venda",
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar estoque:', error);
      toast({
        title: "Erro ao Atualizar Estoque",
        description: "Houve um problema ao atualizar o estoque",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    canAddProduct,
    canUpdateQuantity,
    getAvailableStock,
    canFinalizeSale,
    showStockWarnings,
    showStockErrors,
    updateStockAfterSale,
    getRealStock,
    settings
  };
}; 