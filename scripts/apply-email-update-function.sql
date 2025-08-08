-- Script para criar função de atualização de email
-- Execute este script no SQL Editor do Supabase

-- 1. Criar função para atualizar email de usuário
CREATE OR REPLACE FUNCTION public.update_user_email(user_id_param UUID, new_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Verificar se o parâmetro é válido
  IF user_id_param IS NULL OR new_email IS NULL OR new_email = '' THEN
    RETURN FALSE;
  END IF;
  
  -- Atualizar o email do usuário na tabela auth.users
  UPDATE auth.users
  SET email = new_email,
      updated_at = now()
  WHERE id = user_id_param;
  
  -- Retornar TRUE se pelo menos uma linha foi afetada
  RETURN FOUND;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro (opcional)
    RAISE NOTICE 'Erro ao atualizar email para user_id: % - %', user_id_param, SQLERRM;
    RETURN FALSE;
END;
$$;

-- 2. Verificar se a função foi criada
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'update_user_email';

-- 3. Testar a função (substitua os valores pelos reais)
-- SELECT public.update_user_email('USER_ID_AQUI', 'novo@email.com'); 