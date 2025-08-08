-- =====================================================
-- SCRIPT: Atualizar Estoque Após Venda
-- DESCRIÇÃO: Atualiza o estoque dos produtos após uma venda
-- =====================================================

-- Função para atualizar estoque após venda
CREATE OR REPLACE FUNCTION public.update_stock_after_sale(sale_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sale_item RECORD;
  product_record RECORD;
  new_stock INTEGER;
BEGIN
  -- Verificar se a venda existe
  IF NOT EXISTS (SELECT 1 FROM public.sales WHERE id = sale_id) THEN
    RAISE NOTICE 'Venda não encontrada: %', sale_id;
    RETURN FALSE;
  END IF;

  -- Iterar sobre todos os itens da venda
  FOR sale_item IN 
    SELECT * FROM public.sale_items WHERE sale_id = sale_id
  LOOP
    -- Buscar o produto
    SELECT * INTO product_record FROM public.products WHERE id = sale_item.product_id;
    
    IF FOUND THEN
      -- Calcular novo estoque
      new_stock = product_record.quantity - sale_item.quantity;
      
      -- Atualizar estoque do produto
      UPDATE public.products 
      SET quantity = new_stock,
          updated_at = now()
      WHERE id = sale_item.product_id;
      
      -- Log da atualização
      RAISE NOTICE 'Produto %: estoque atualizado de % para % (vendidos: %)', 
        product_record.name, 
        product_record.quantity, 
        new_stock, 
        sale_item.quantity;
      
      -- Se estoque ficou baixo, registrar alerta
      IF new_stock <= 3 AND new_stock >= 0 THEN
        INSERT INTO public.stock_alerts (product_id, product_name, current_stock, alert_type, created_at)
        VALUES (product_record.id, product_record.name, new_stock, 'low_stock', now());
      END IF;
      
      -- Se estoque ficou negativo, registrar alerta
      IF new_stock < 0 THEN
        INSERT INTO public.stock_alerts (product_id, product_name, current_stock, alert_type, created_at)
        VALUES (product_record.id, product_record.name, new_stock, 'negative_stock', now());
      END IF;
      
    ELSE
      RAISE NOTICE 'Produto não encontrado: %', sale_item.product_id;
    END IF;
  END LOOP;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Erro ao atualizar estoque: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar estoque automaticamente após inserção de venda
CREATE OR REPLACE FUNCTION public.handle_sale_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar estoque após inserção da venda
  PERFORM public.update_stock_after_sale(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_update_stock_after_sale ON public.sales;
CREATE TRIGGER trigger_update_stock_after_sale
  AFTER INSERT ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_sale_insert();

-- Tabela para alertas de estoque (se não existir)
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  current_stock INTEGER NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'negative_stock', 'out_of_stock')),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Função para verificar estoque disponível
CREATE OR REPLACE FUNCTION public.get_available_stock(product_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT quantity INTO available_stock
  FROM public.products
  WHERE id = product_id_param;
  
  IF FOUND THEN
    RETURN available_stock;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para verificar se produto pode ser vendido
CREATE OR REPLACE FUNCTION public.can_sell_product(product_id_param UUID, requested_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT quantity INTO available_stock
  FROM public.products
  WHERE id = product_id_param;
  
  IF FOUND THEN
    -- Produtos temporários sempre podem ser vendidos
    IF (SELECT category FROM public.products WHERE id = product_id_param) = 'Temporário' THEN
      RETURN TRUE;
    END IF;
    
    -- Verificar se há estoque suficiente
    RETURN available_stock >= requested_quantity;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Verificar se as funções foram criadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('update_stock_after_sale', 'get_available_stock', 'can_sell_product')
ORDER BY routine_name; 