-- Script para corrigir problemas de usuários
-- Execute este script no SQL Editor do Supabase

-- 1. Corrigir a função handle_new_user para incluir telefone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'vendedor')
  );
  RETURN NEW;
END;
$$;

-- 2. Melhorar a função get_user_email
CREATE OR REPLACE FUNCTION public.get_user_email(user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Verificar se o usuário existe
  IF user_id_param IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Buscar o email do usuário
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id_param;
  
  RETURN user_email;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, retornar NULL
    RETURN NULL;
END;
$$;

-- 3. Verificar se a função update_updated_at_column existe
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Garantir que o trigger para profiles existe
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Verificar se todos os usuários existentes têm telefone
-- Se algum usuário não tiver telefone, definir como vazio
UPDATE public.profiles 
SET phone = '' 
WHERE phone IS NULL; 