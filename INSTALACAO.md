# 🚀 GUIA DE INSTALAÇÃO - ROUPA CERTA VENDAS PLUS

## 📋 Pré-requisitos

### Requisitos do Sistema
- **Node.js:** Versão 18.0.0 ou superior
- **npm:** Versão 8.0.0 ou superior
- **Git:** Para clonar o repositório
- **Navegador:** Chrome 90+, Firefox 88+, Safari 14+

### Conta no Supabase
- Crie uma conta em [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote a URL e chave anônima do projeto

## 🔧 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/roupa-certa-vendas-plus.git

# Entre no diretório
cd roupa-certa-vendas-plus
```

### 2. Instale as Dependências

```bash
# Instale todas as dependências
npm install

# Verifique se a instalação foi bem-sucedida
npm run build
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações obrigatórias
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Configurações opcionais
VITE_APP_ENV=development
VITE_DEBUG=true
```

### 4. Configure o Banco de Dados

#### 4.1 Acesse o Supabase Dashboard
- Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
- Selecione seu projeto

#### 4.2 Execute as Migrações
- Vá para **SQL Editor**
- Execute o script de migração principal:

```sql
-- Copie e cole o conteúdo do arquivo:
-- supabase/migrations/20250702151431-12c3222c-0c00-4b6b-b35c-8569daf1e9e0.sql
```

#### 4.3 Configure as Políticas de Segurança
- Vá para **Authentication > Policies**
- Configure as políticas RLS (Row Level Security) conforme necessário

### 5. Configure o Storage (Opcional)

#### 5.1 Crie um Bucket para Imagens
- Vá para **Storage**
- Crie um bucket chamado `product-images`
- Configure as políticas de acesso

#### 5.2 Configure as Políticas de Storage
```sql
-- Política para upload de imagens
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para visualização de imagens
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (true);
```

### 6. Inicie o Servidor de Desenvolvimento

```bash
# Inicie o servidor
npm run dev

# A aplicação estará disponível em:
# http://localhost:8081
```

### 7. Crie o Primeiro Usuário

#### 7.1 Via Supabase Dashboard
- Vá para **Authentication > Users**
- Clique em **Add User**
- Preencha os dados do administrador

#### 7.2 Via Script (Recomendado)
Execute o script de criação de usuário:

```bash
# Execute o script
node create-admin-user.js

# Siga as instruções no terminal
```

## 🔐 Configuração de Segurança

### 1. Configurar Políticas de Senha

```sql
-- No SQL Editor do Supabase
UPDATE auth.users 
SET password_changed_at = NOW() 
WHERE email = 'admin@roupacerta.com';
```

### 2. Configurar Sessões

```sql
-- Configurar timeout de sessão
UPDATE auth.config 
SET session_timeout = 28800; -- 8 horas
```

### 3. Configurar Rate Limiting

```sql
-- Configurar rate limiting para autenticação
-- (Configuração automática no Supabase)
```

## 📱 Configuração de Produção

### 1. Build de Produção

```bash
# Crie o build de produção
npm run build

# Teste o build localmente
npm run preview
```

### 2. Deploy no Vercel (Recomendado)

#### 2.1 Conecte ao Vercel
- Vá para [vercel.com](https://vercel.com)
- Conecte seu repositório GitHub
- Configure as variáveis de ambiente

#### 2.2 Configure as Variáveis
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=production
```

#### 2.3 Deploy
- O Vercel fará deploy automático
- Configure o domínio personalizado se necessário

### 3. Deploy no Netlify

#### 3.1 Conecte ao Netlify
- Vá para [netlify.com](https://netlify.com)
- Conecte seu repositório
- Configure as variáveis de ambiente

#### 3.2 Configurações de Build
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18`

## 🧪 Testes

### 1. Testes Manuais

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Teste as funcionalidades principais:
# - Login/logout
# - Cadastro de produtos
# - Realização de vendas
# - Criação de devoluções
# - Relatórios
```

### 2. Testes Automatizados (Futuro)

```bash
# Execute os testes unitários
npm run test

# Execute os testes de integração
npm run test:integration

# Execute os testes E2E
npm run test:e2e
```

## 🔧 Configurações Avançadas

### 1. Configurar HTTPS Local

```bash
# Instale mkcert
brew install mkcert  # macOS
# ou
sudo apt install mkcert  # Ubuntu

# Configure certificados locais
mkcert -install
mkcert localhost

# Configure o Vite para HTTPS
# vite.config.ts
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
});
```

### 2. Configurar Proxy Reverso

```nginx
# Exemplo para Nginx
server {
    listen 80;
    server_name roupa-certa.local;
    
    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Configurar Cache

```bash
# Configure cache para produção
# No Vercel ou Netlify, configure:
# - Cache-Control headers
# - Service Workers (futuro)
# - CDN caching
```

## 🐛 Solução de Problemas

### 1. Erro de Conexão com Supabase

```bash
# Verifique as variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Teste a conexão
curl -X GET "https://your-project.supabase.co/rest/v1/products" \
  -H "apikey: your-anon-key"
```

### 2. Erro de Build

```bash
# Limpe o cache
npm run clean

# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install

# Tente o build novamente
npm run build
```

### 3. Erro de Migração

```sql
-- Verifique se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verifique se os tipos ENUM foram criados
SELECT typname 
FROM pg_type 
WHERE typtype = 'e';
```

### 4. Erro de Autenticação

```bash
# Verifique as políticas RLS
-- No SQL Editor do Supabase
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

## 📞 Suporte

### Canais de Suporte
- **Email:** suporte@roupacerta.com
- **Documentação:** [docs.roupacerta.com](https://docs.roupacerta.com)
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/roupa-certa-vendas-plus/issues)

### Logs Úteis
```bash
# Logs do navegador
# F12 > Console

# Logs do servidor de desenvolvimento
# Terminal onde npm run dev foi executado

# Logs do Supabase
# Dashboard > Logs
```

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] npm 8+ instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Migrações executadas
- [ ] Usuário administrador criado
- [ ] Servidor iniciado
- [ ] Login funcionando
- [ ] Funcionalidades testadas
- [ ] Deploy configurado (produção)

---

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025  
**Autor:** Equipe de Desenvolvimento 