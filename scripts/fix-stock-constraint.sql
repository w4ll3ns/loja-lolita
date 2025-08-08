-- =====================================================
-- SCRIPT: Corrigir Constraint de Estoque
-- DESCRIÇÃO: Remove a constraint que impede estoque negativo
-- =====================================================

-- Verificar se existe a constraint
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'products_quantity_check';

-- Remover a constraint se existir
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS products_quantity_check;

-- Verificar se a constraint foi removida
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'products_quantity_check';

-- Verificar a estrutura atual da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name = 'quantity';

-- Testar inserção com valor negativo
UPDATE public.products 
SET quantity = -1 
WHERE id = (
  SELECT id FROM public.products 
  WHERE quantity > 0 
  LIMIT 1
);

-- Verificar se a atualização funcionou
SELECT 
  name,
  quantity
FROM public.products 
WHERE quantity < 0;

-- Restaurar o valor original (opcional)
UPDATE public.products 
SET quantity = 0 
WHERE quantity < 0; 