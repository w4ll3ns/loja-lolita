-- Script para corrigir a função de busca de email
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a função existe
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'get_user_email';

-- 2. Recriar a função com melhor tratamento de erro
DROP FUNCTION IF EXISTS public.get_user_email(UUID);

CREATE OR REPLACE FUNCTION public.get_user_email(user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Verificar se o parâmetro é válido
  IF user_id_param IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Buscar o email do usuário na tabela auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id_param;
  
  -- Retornar o email encontrado ou NULL
  RETURN user_email;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro (opcional)
    RAISE NOTICE 'Erro ao buscar email para user_id: % - %', user_id_param, SQLERRM;
    RETURN NULL;
END;
$$;

-- 3. Testar a função com um usuário existente
-- Substitua 'USER_ID_AQUI' pelo ID de um usuário real
-- SELECT public.get_user_email('USER_ID_AQUI');

-- 4. Verificar as políticas de segurança
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'auth';

-- 5. Verificar se o usuário atual tem permissão para acessar auth.users
SELECT current_user, session_user; 