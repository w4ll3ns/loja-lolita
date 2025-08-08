-- =====================================================
-- SCRIPT: Adicionar Campos de Estoque
-- DESCRIÇÃO: Adiciona campos para controlar estoque negativo sem mexer na constraint
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

-- Atualizar todos os produtos existentes
UPDATE public.products 
SET available_stock = quantity - reserved_stock
WHERE available_stock IS NULL;

-- Verificar se os campos foram adicionados
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('negative_stock', 'reserved_stock', 'available_stock')
ORDER BY column_name; 