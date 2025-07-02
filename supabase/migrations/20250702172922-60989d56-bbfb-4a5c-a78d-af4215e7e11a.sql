-- Inserir o primeiro usuário administrador
INSERT INTO public.users (name, email, phone, role, active) 
VALUES (
  'Wallen Santiago',
  'wallen.santiago@live.com',
  '(98) 98287-7874',
  'admin',
  true
);