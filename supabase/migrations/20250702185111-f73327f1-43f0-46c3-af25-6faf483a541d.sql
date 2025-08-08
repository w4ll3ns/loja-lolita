-- Remove a tabela users não utilizada
-- Os dados dos usuários estão sendo armazenados corretamente na tabela profiles
DROP TABLE IF EXISTS public.users;

-- Função para buscar usuários com emails
CREATE OR REPLACE FUNCTION public.get_users_with_emails()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  role user_role,
  active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.name,
    u.email,
    p.phone,
    p.role,
    p.active,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.user_id = u.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Função para buscar email de um usuário específico
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