-- =====================================================
-- SCRIPT: Adicionar Campo de Estoque Negativo
-- DESCRIÇÃO: Adiciona campo para controlar estoque negativo sem violar constraint
-- =====================================================

-- Adicionar campo para estoque negativo
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS negative_stock INTEGER DEFAULT 0;

-- Adicionar campo para estoque reservado (em vendas)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS reserved_stock INTEGER DEFAULT 0;

-- Adicionar campo para estoque disponível (calculado)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS available_stock INTEGER DEFAULT 0;

-- Função para calcular estoque disponível
CREATE OR REPLACE FUNCTION public.calculate_available_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular estoque disponível = quantity - reserved_stock
  NEW.available_stock = NEW.quantity - NEW.reserved_stock;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estoque disponível automaticamente
DROP TRIGGER IF EXISTS trigger_calculate_available_stock ON public.products;
CREATE TRIGGER trigger_calculate_available_stock
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_available_stock();

-- Função para atualizar estoque após venda
CREATE OR REPLACE FUNCTION public.update_stock_after_sale_v2(sale_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sale_item RECORD;
  product_record RECORD;
  new_stock INTEGER;
  negative_amount INTEGER;
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
      
      -- Se ficou negativo, registrar no campo negative_stock
      IF new_stock < 0 THEN
        negative_amount = ABS(new_stock);
        new_stock = 0; -- Manter quantity >= 0
      ELSE
        negative_amount = 0;
      END IF;
      
      -- Atualizar estoque do produto
      UPDATE public.products 
      SET quantity = new_stock,
          negative_stock = negative_amount,
          updated_at = now()
      WHERE id = sale_item.product_id;
      
      -- Log da atualização
      RAISE NOTICE 'Produto %: estoque atualizado de % para % (vendidos: %, negativo: %)', 
        product_record.name, 
        product_record.quantity, 
        new_stock, 
        sale_item.quantity,
        negative_amount;
      
      -- Se estoque ficou baixo, registrar alerta
      IF new_stock <= 3 AND new_stock >= 0 THEN
        INSERT INTO public.stock_alerts (product_id, product_name, current_stock, alert_type, created_at)
        VALUES (product_record.id, product_record.name, new_stock, 'low_stock', now());
      END IF;
      
      -- Se ficou negativo, registrar alerta
      IF negative_amount > 0 THEN
        INSERT INTO public.stock_alerts (product_id, product_name, current_stock, alert_type, created_at)
        VALUES (product_record.id, product_record.name, -negative_amount, 'negative_stock', now());
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

-- Função para verificar estoque disponível
CREATE OR REPLACE FUNCTION public.get_available_stock_v2(product_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT (quantity - reserved_stock) INTO available_stock
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
CREATE OR REPLACE FUNCTION public.can_sell_product_v2(product_id_param UUID, requested_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT (quantity - reserved_stock) INTO available_stock
  FROM public.products
  WHERE id = product_id_param;
  
  IF FOUND THEN
    -- Produtos temporários sempre podem ser vendidos
    IF (SELECT category FROM public.products WHERE id = product_id_param) = 'Temporário' THEN
      RETURN TRUE;
    END IF;
    
    -- Verificar se há estoque suficiente (permitir negativo)
    RETURN TRUE; -- Sempre permitir, mas registrar negativo
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Atualizar todos os produtos existentes
UPDATE public.products 
SET available_stock = quantity - reserved_stock
WHERE available_stock IS NULL;

-- Verificar se as funções foram criadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('update_stock_after_sale_v2', 'get_available_stock_v2', 'can_sell_product_v2')
ORDER BY routine_name; 