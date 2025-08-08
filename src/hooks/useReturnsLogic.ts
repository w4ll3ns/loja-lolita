import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Return, 
  CreateReturnData, 
  ReturnFilters, 
  ReturnStats,
  StoreCredit,
  CreateStoreCreditData
} from '@/types/returns';
import { supabase } from '@/integrations/supabase/client';

export const useReturnsLogic = () => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [storeCredits, setStoreCredits] = useState<StoreCredit[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar devoluções
  const loadReturns = useCallback(async (filters?: ReturnFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('returns')
        .select(`
          *,
          sale:sales(*),
          customer:customers(*),
          return_items(
            *,
            product:products(*)
          ),
          exchange_items(
            *,
            original_product:products!exchange_items_original_product_id_fkey(*),
            new_product:products!exchange_items_new_product_id_fkey(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.return_type) query = query.eq('return_type', filters.return_type);
        if (filters.customer_id) query = query.eq('customer_id', filters.customer_id);
        if (filters.date_from) query = query.gte('created_at', filters.date_from);
        if (filters.date_to) query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query as any;

      if (error) {
        console.error('Error loading returns:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar devoluções",
          variant: "destructive"
        });
        return;
      }

      // Transformar os dados para o formato esperado
      const formattedReturns: Return[] = (data || []).map((item: any) => ({
        id: item.id,
        sale_id: item.sale_id,
        customer_id: item.customer_id,
        return_type: item.return_type,
        return_reason: item.return_reason,
        status: item.status,
        refund_method: item.refund_method,
        refund_amount: item.refund_amount,
        store_credit_amount: item.store_credit_amount,
        notes: item.notes,
        processed_by: item.processed_by,
        processed_at: item.processed_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        sale: item.sale,
        customer: item.customer,
        return_items: item.return_items || [],
        exchange_items: item.exchange_items || []
      }));

      setReturns(formattedReturns);
    } catch (error) {
      console.error('Error loading returns:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar devoluções",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carregar créditos da loja
  const loadStoreCredits = useCallback(async (customerId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('store_credits')
        .select(`
          *,
          customer:customers(*),
          transactions:store_credit_transactions(*)
        `)
        .order('created_at', { ascending: false });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query as any;

      if (error) {
        console.error('Error loading store credits:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar créditos da loja",
          variant: "destructive"
        });
        return;
      }

      // Transformar os dados para o formato esperado
      const formattedCredits: StoreCredit[] = (data || []).map((item: any) => ({
        id: item.id,
        customer_id: item.customer_id,
        amount: item.amount,
        balance: item.balance,
        expires_at: item.expires_at,
        notes: item.notes,
        created_at: item.created_at,
        updated_at: item.updated_at,
        customer: item.customer,
        transactions: (item.transactions || []).map((transaction: any) => ({
          id: transaction.id,
          store_credit_id: transaction.store_credit_id,
          transaction_type: transaction.transaction_type as 'credit' | 'debit',
          amount: transaction.amount,
          description: transaction.description,
          related_sale_id: transaction.related_sale_id,
          related_return_id: transaction.related_return_id,
          created_at: transaction.created_at
        }))
      }));

      setStoreCredits(formattedCredits);
    } catch (error) {
      console.error('Error loading store credits:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar créditos da loja",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Criar devolução
  const createReturn = useCallback(async (returnData: CreateReturnData, processedBy: string) => {
    setLoading(true);
    try {
      // Calcular o valor total da devolução (quantidade * preço de reembolso)
      const refundAmount = returnData.items.reduce((sum, item) => sum + (item.refund_price * item.quantity), 0);
      // 1. Criar a devolução
      const { data: returnRecord, error: returnError } = await supabase
        .from('returns')
        .insert({
          sale_id: returnData.sale_id,
          customer_id: returnData.customer_id,
          return_type: returnData.return_type,
          return_reason: returnData.return_reason,
          refund_method: returnData.refund_method,
          notes: returnData.notes,
          processed_by: processedBy,
          status: 'pending',
          refund_amount: refundAmount,
          store_credit_amount: returnData.refund_method === 'store_credit' ? refundAmount : 0
        } as any)
        .select()
        .single();

      if (returnError) {
        console.error('Error creating return:', returnError);
        toast({
          title: "Erro",
          description: "Erro ao criar devolução",
          variant: "destructive"
        });
        return null;
      }

      // 2. Criar itens da devolução usando os UUIDs reais enviados
      const returnItems = returnData.items.map(item => ({
        return_id: returnRecord.id,
        sale_item_id: item.sale_item_id, // Já é o UUID real do sale_item
        product_id: item.product_id,
        quantity: item.quantity,
        original_price: item.original_price,
        refund_price: item.refund_price,
        condition_description: item.condition_description
      }));

      const { error: itemsError } = await supabase
        .from('return_items')
        .insert(returnItems as any);

      if (itemsError) {
        console.error('Error creating return items:', itemsError);
        // Rollback return if items fail
        await supabase.from('returns').delete().eq('id', returnRecord.id);
        toast({
          title: "Erro",
          description: "Erro ao criar itens da devolução",
          variant: "destructive"
        });
        return null;
      }

      // 3. Se for troca, criar itens de troca
      if (returnData.exchange_items && returnData.exchange_items.length > 0) {
        const exchangeItems = returnData.exchange_items.map(item => ({
          return_id: returnRecord.id,
          original_product_id: item.original_product_id,
          new_product_id: item.new_product_id,
          quantity: item.quantity,
          price_difference: item.price_difference
        }));

        const { error: exchangeError } = await supabase
          .from('exchange_items')
          .insert(exchangeItems as any);

        if (exchangeError) {
          console.error('Error creating exchange items:', exchangeError);
          // Rollback return and items if exchange fails
          await supabase.from('return_items').delete().eq('return_id', returnRecord.id);
          await supabase.from('returns').delete().eq('id', returnRecord.id);
          toast({
            title: "Erro",
            description: "Erro ao criar itens de troca",
            variant: "destructive"
          });
          return null;
        }
      }

      toast({
        title: "Sucesso",
        description: "Devolução criada com sucesso"
      });

      // Recarregar devoluções
      await loadReturns();
      return returnRecord;
    } catch (error) {
      console.error('Error creating return:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar devolução",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, loadReturns]);

  // Aprovar devolução
  const approveReturn = useCallback(async (returnId: string, processedBy: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('returns')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString(),
          processed_by: processedBy
        } as any)
        .eq('id', returnId);

      if (error) {
        console.error('Error approving return:', error);
        toast({
          title: "Erro",
          description: "Erro ao aprovar devolução",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Devolução aprovada com sucesso"
      });

      await loadReturns();
      return true;
    } catch (error) {
      console.error('Error approving return:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar devolução",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, loadReturns]);

  // Rejeitar devolução
  const rejectReturn = useCallback(async (returnId: string, processedBy: string, notes?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('returns')
        .update({
          status: 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: processedBy,
          notes: notes
        } as any)
        .eq('id', returnId);

      if (error) {
        console.error('Error rejecting return:', error);
        toast({
          title: "Erro",
          description: "Erro ao rejeitar devolução",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Devolução rejeitada"
      });

      await loadReturns();
      return true;
    } catch (error) {
      console.error('Error rejecting return:', error);
      toast({
        title: "Erro",
        description: "Erro ao rejeitar devolução",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, loadReturns]);

  // Finalizar devolução (completar)
  const completeReturn = useCallback(async (returnId: string, processedBy: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('returns')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          processed_by: processedBy
        } as any)
        .eq('id', returnId);

      if (error) {
        console.error('Error completing return:', error);
        toast({
          title: "Erro",
          description: "Erro ao finalizar devolução",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Devolução finalizada com sucesso"
      });

      await loadReturns();
      return true;
    } catch (error) {
      console.error('Error completing return:', error);
      toast({
        title: "Erro",
        description: "Erro ao finalizar devolução",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, loadReturns]);

  // Criar crédito da loja
  const createStoreCredit = useCallback(async (creditData: CreateStoreCreditData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_credits')
        .insert({
          customer_id: creditData.customer_id,
          amount: creditData.amount,
          balance: creditData.amount,
          expires_at: creditData.expires_at,
          notes: creditData.notes
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating store credit:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar crédito da loja",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Crédito da loja criado com sucesso"
      });

      await loadStoreCredits();
      return data;
    } catch (error) {
      console.error('Error creating store credit:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar crédito da loja",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, loadStoreCredits]);

  // Obter estatísticas de devoluções
  const getReturnStats = useCallback(async (): Promise<ReturnStats | null> => {
    try {
      const { data: returnsData, error } = await supabase
        .from('returns')
        .select('return_type, return_reason, status, refund_amount, store_credit_amount') as any;

      if (error) {
        console.error('Error loading return stats:', error);
        return null;
      }

      const stats: ReturnStats = {
        total_returns: 0,
        total_exchanges: 0,
        total_refunded: 0,
        total_store_credits: 0,
        returns_by_reason: {
          defective: 0,
          wrong_size: 0,
          wrong_color: 0,
          not_liked: 0,
          other: 0
        },
        returns_by_status: {
          pending: 0,
          approved: 0,
          rejected: 0,
          completed: 0
        }
      };

      returnsData?.forEach(returnItem => {
        if (returnItem.return_type === 'return') stats.total_returns++;
        if (returnItem.return_type === 'exchange') stats.total_exchanges++;
        
        stats.total_refunded += returnItem.refund_amount || 0;
        stats.total_store_credits += returnItem.store_credit_amount || 0;
        
        stats.returns_by_reason[returnItem.return_reason]++;
        stats.returns_by_status[returnItem.status]++;
      });

      return stats;
    } catch (error) {
      console.error('Error calculating return stats:', error);
      return null;
    }
  }, []);

  return {
    returns,
    storeCredits,
    loading,
    loadReturns,
    loadStoreCredits,
    createReturn,
    approveReturn,
    rejectReturn,
    completeReturn,
    createStoreCredit,
    getReturnStats
  };
}; 