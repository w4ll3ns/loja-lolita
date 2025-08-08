-- =====================================================
-- SCRIPT SIMPLES: Remover Constraint de Estoque
-- DESCRIÇÃO: Remove a constraint que impede estoque negativo
-- =====================================================

-- Remover a constraint diretamente
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_quantity_check;

-- Verificar se foi removida
SELECT 
  constraint_name
FROM information_schema.check_constraints 
WHERE constraint_name = 'products_quantity_check';

-- Testar se agora aceita valores negativos
UPDATE public.products 
SET quantity = -1 
WHERE id = (
  SELECT id FROM public.products 
  WHERE quantity > 0 
  LIMIT 1
);

-- Verificar se funcionou
SELECT 
  name,
  quantity
FROM public.products 
WHERE quantity < 0;

-- Restaurar valor original
UPDATE public.products 
SET quantity = 0 
WHERE quantity < 0; 