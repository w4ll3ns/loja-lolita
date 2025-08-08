-- Script para inserir usuários vendedores de teste
-- Execute este script no Supabase SQL Editor

-- Inserir usuários vendedores de teste
INSERT INTO public.profiles (name, email, phone, role, active) VALUES
('João Silva', 'joao.silva@roupacerta.com', '(11) 99999-1111', 'vendedor', true),
('Maria Santos', 'maria.santos@roupacerta.com', '(11) 99999-2222', 'vendedor', true),
('Pedro Oliveira', 'pedro.oliveira@roupacerta.com', '(11) 99999-3333', 'vendedor', true),
('Ana Costa', 'ana.costa@roupacerta.com', '(11) 99999-4444', 'vendedor', true),
('Carlos Ferreira', 'carlos.ferreira@roupacerta.com', '(11) 99999-5555', 'vendedor', true);

-- Verificar se foram inseridos
SELECT * FROM public.profiles WHERE role = 'vendedor' ORDER BY created_at DESC;
