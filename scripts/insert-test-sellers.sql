-- Script para inserir vendedores de teste
-- Execute este script no Supabase SQL Editor

-- Inserir vendedores de teste
INSERT INTO public.sellers (name, email, phone, active) VALUES
('João Silva', 'joao.silva@roupacerta.com', '(11) 99999-1111', true),
('Maria Santos', 'maria.santos@roupacerta.com', '(11) 99999-2222', true),
('Pedro Oliveira', 'pedro.oliveira@roupacerta.com', '(11) 99999-3333', true),
('Ana Costa', 'ana.costa@roupacerta.com', '(11) 99999-4444', true),
('Carlos Ferreira', 'carlos.ferreira@roupacerta.com', '(11) 99999-5555', true);

-- Verificar se foram inseridos
SELECT * FROM public.sellers ORDER BY created_at DESC;

