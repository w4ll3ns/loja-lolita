-- Script para aplicar a migração de devoluções no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tipos ENUM
DO $$ BEGIN
  CREATE TYPE public.return_type AS ENUM ('return', 'exchange');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.return_reason AS ENUM ('defective', 'wrong_size', 'wrong_color', 'not_liked', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.return_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.refund_method AS ENUM ('same_payment', 'store_credit', 'exchange');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Criar tabela returns
CREATE TABLE IF NOT EXISTS public.returns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  return_type return_type NOT NULL,
  return_reason return_reason NOT NULL,
  status return_status NOT NULL DEFAULT 'pending',
  refund_method refund_method,
  refund_amount DECIMAL(10,2) CHECK (refund_amount >= 0),
  store_credit_amount DECIMAL(10,2) DEFAULT 0 CHECK (store_credit_amount >= 0),
  notes TEXT,
  processed_by TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Criar tabela return_items
CREATE TABLE IF NOT EXISTS public.return_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
  sale_item_id UUID NOT NULL REFERENCES public.sale_items(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
  refund_price DECIMAL(10,2) NOT NULL CHECK (refund_price >= 0),
  condition_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Criar tabela exchange_items
CREATE TABLE IF NOT EXISTS public.exchange_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
  original_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  new_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_difference DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Criar tabela store_credits
CREATE TABLE IF NOT EXISTS public.store_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  balance DECIMAL(10,2) NOT NULL CHECK (balance >= 0),
  expires_at DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Criar tabela store_credit_transactions
CREATE TABLE IF NOT EXISTS public.store_credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_credit_id UUID NOT NULL REFERENCES public.store_credits(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  related_sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  related_return_id UUID REFERENCES public.returns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Criar índices
CREATE INDEX IF NOT EXISTS idx_returns_sale_id ON public.returns(sale_id);
CREATE INDEX IF NOT EXISTS idx_returns_customer_id ON public.returns(customer_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON public.returns(status);
CREATE INDEX IF NOT EXISTS idx_returns_created_at ON public.returns(created_at);
CREATE INDEX IF NOT EXISTS idx_return_items_return_id ON public.return_items(return_id);
CREATE INDEX IF NOT EXISTS idx_return_items_product_id ON public.return_items(product_id);
CREATE INDEX IF NOT EXISTS idx_exchange_items_return_id ON public.exchange_items(return_id);
CREATE INDEX IF NOT EXISTS idx_store_credits_customer_id ON public.store_credits(customer_id);
CREATE INDEX IF NOT EXISTS idx_store_credits_expires_at ON public.store_credits(expires_at);
CREATE INDEX IF NOT EXISTS idx_store_credit_transactions_store_credit_id ON public.store_credit_transactions(store_credit_id);

-- 8. Habilitar RLS
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_credit_transactions ENABLE ROW LEVEL SECURITY;

-- 9. Criar políticas
DROP POLICY IF EXISTS "Users can view returns" ON public.returns;
CREATE POLICY "Users can view returns" ON public.returns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and caixa can insert returns" ON public.returns;
CREATE POLICY "Admin and caixa can insert returns" ON public.returns FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and caixa can update returns" ON public.returns;
CREATE POLICY "Admin and caixa can update returns" ON public.returns FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can view return items" ON public.return_items;
CREATE POLICY "Users can view return items" ON public.return_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and caixa can insert return items" ON public.return_items;
CREATE POLICY "Admin and caixa can insert return items" ON public.return_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and caixa can update return items" ON public.return_items;
CREATE POLICY "Admin and caixa can update return items" ON public.return_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can view exchange items" ON public.exchange_items;
CREATE POLICY "Users can view exchange items" ON public.exchange_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and caixa can insert exchange items" ON public.exchange_items;
CREATE POLICY "Admin and caixa can insert exchange items" ON public.exchange_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and caixa can update exchange items" ON public.exchange_items;
CREATE POLICY "Admin and caixa can update exchange items" ON public.exchange_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can view store credits" ON public.store_credits;
CREATE POLICY "Users can view store credits" ON public.store_credits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and caixa can insert store credits" ON public.store_credits;
CREATE POLICY "Admin and caixa can insert store credits" ON public.store_credits FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and caixa can update store credits" ON public.store_credits;
CREATE POLICY "Admin and caixa can update store credits" ON public.store_credits FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can view store credit transactions" ON public.store_credit_transactions;
CREATE POLICY "Users can view store credit transactions" ON public.store_credit_transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and caixa can insert store credit transactions" ON public.store_credit_transactions;
CREATE POLICY "Admin and caixa can insert store credit transactions" ON public.store_credit_transactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and caixa can update store credit transactions" ON public.store_credit_transactions;
CREATE POLICY "Admin and caixa can update store credit transactions" ON public.store_credit_transactions FOR UPDATE USING (true);

-- 10. Adicionar triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_returns_updated_at ON public.returns;
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_credits_updated_at ON public.store_credits;
CREATE TRIGGER update_store_credits_updated_at BEFORE UPDATE ON public.store_credits FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column(); 