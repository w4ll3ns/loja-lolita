# 📁 Scripts do Sistema

Esta pasta contém scripts úteis para configuração, migração e manutenção do sistema.

## 🔧 Scripts de Configuração

### `apply-email-function.sql`
**Descrição:** Cria a função SQL `get_user_email` no Supabase para buscar emails de usuários.
**Uso:** Execute no SQL Editor do Supabase quando emails não aparecerem na listagem de usuários.
**Status:** ✅ Funcional

### `apply-email-update-function.sql`
**Descrição:** Cria a função SQL `update_user_email` no Supabase para atualizar emails de usuários.
**Uso:** Execute no SQL Editor do Supabase para permitir atualização de emails por administradores.
**Status:** ✅ Funcional

### `apply-user-fixes.sql`
**Descrição:** Script consolidado com correções para problemas de usuários (email e telefone).
**Uso:** Execute no SQL Editor do Supabase para aplicar todas as correções de usuários de uma vez.
**Status:** ✅ Funcional

### `apply-secure-rls-policies.sql` ⭐ **NOVO**
**Descrição:** Implementa políticas RLS (Row Level Security) restritivas e seguras.
**Funcionalidades:**
- Profiles: Usuários veem apenas seus próprios, admins veem todos
- Produtos: Apenas admins podem gerenciar
- Vendas: Vendedores veem apenas suas vendas, admins veem todas
- Clientes: Apenas admins podem gerenciar
- Configurações: Apenas admins podem gerenciar
- Logs: Apenas admins podem ver
**Uso:** Execute no SQL Editor do Supabase para aplicar segurança avançada.
**Status:** ✅ Funcional

## 🧪 Scripts de Teste

### `test-email-function-simple.js`
**Descrição:** Testa a função `get_user_email` de forma simples.
**Uso:** `node scripts/test-email-function-simple.js`
**Status:** ✅ Funcional

### `test-email-update.js`
**Descrição:** Testa a função `update_user_email` para atualização de emails.
**Uso:** `node scripts/test-email-update.js`
**Status:** ✅ Funcional

### `test-rls-policies.js` ⭐ **NOVO**
**Descrição:** Testa as políticas RLS implementadas para verificar se estão funcionando corretamente.
**Funcionalidades:**
- Testa acesso sem autenticação
- Testa login como admin
- Verifica permissões de acesso
- Testa funções is_admin e is_seller
- Valida políticas de segurança
**Uso:** `node scripts/test-rls-policies.js`
**Configuração:** Edite o arquivo para definir credenciais de admin reais
**Status:** ✅ Funcional

## 👤 Scripts de Usuários

### `create-admin-user.js`
**Descrição:** Cria um usuário administrador no sistema.
**Uso:** `node scripts/create-admin-user.js`
**Configuração:** Edite o arquivo para definir email, senha e dados do admin.
**Status:** ✅ Funcional

## 📦 Scripts de Migração

### `apply-returns-migration.js`
**Descrição:** Aplica migração completa do sistema de devoluções.
**Uso:** `node scripts/apply-returns-migration.js`
**Status:** ✅ Funcional

### `returns-migration.sql`
**Descrição:** Script SQL para criar tabelas de devoluções.
**Uso:** Execute no SQL Editor do Supabase.
**Status:** ✅ Funcional

## 🚀 Como Usar

1. **Para scripts SQL:** Execute diretamente no SQL Editor do Supabase
2. **Para scripts JS:** Execute com Node.js no terminal
3. **Sempre faça backup antes de executar scripts de migração**
4. **Teste em ambiente de desenvolvimento primeiro**

## 📋 Checklist de Segurança

- [x] Políticas RLS implementadas
- [x] Rate limiting de autenticação
- [x] Sanitização de dados de entrada
- [x] Logs sensíveis removidos
- [x] Senha hardcoded removida
- [x] Monitoramento de segurança implementado
- [x] Testes de políticas RLS criados
- [x] Sanitização em formulários críticos

## 🔒 Segurança

Todos os scripts foram testados e são seguros para produção. As políticas RLS garantem que:
- Usuários só acessem dados autorizados
- Administradores tenham controle total
- Vendedores vejam apenas suas vendas
- Dados sensíveis sejam protegidos
- Atividades suspeitas sejam monitoradas
- Tentativas de ataque sejam bloqueadas

## 🧪 Testes de Segurança

### Como testar as políticas RLS:
1. Execute `node scripts/test-rls-policies.js`
2. Verifique se o acesso é negado sem autenticação
3. Teste login como admin e verifique permissões
4. Confirme que vendedores veem apenas suas vendas
5. Valide que admins têm acesso total

### Como testar o rate limiting:
1. Tente fazer login com senha incorreta várias vezes
2. Verifique se o sistema bloqueia após 10 tentativas
3. Confirme que o bloqueio dura 30 minutos
4. Teste se o login bem-sucedido reseta o contador 