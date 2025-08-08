# 📋 DOCUMENTAÇÃO TÉCNICA - ROUPA CERTA VENDAS PLUS

## 📖 ÍNDICE

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Especificações Técnicas](#especificações-técnicas)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Funcionalidades](#funcionalidades)
5. [Banco de Dados](#banco-de-dados)
6. [API e Integrações](#api-e-integrações)
7. [Interface do Usuário](#interface-do-usuário)
8. [Segurança e Autenticação](#segurança-e-autenticação)
9. [Deploy e Infraestrutura](#deploy-e-infraestrutura)
10. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 VISÃO GERAL DO PROJETO

### Descrição
Sistema de gestão de vendas completo para lojas de roupas, desenvolvido com tecnologias modernas e focado em usabilidade e escalabilidade.

### Objetivos
- Automatizar processos de vendas e controle de estoque
- Fornecer relatórios gerenciais em tempo real
- Gerenciar devoluções e trocas de forma eficiente
- Controlar acesso de usuários por perfis específicos
- Facilitar a gestão de produtos e clientes

### Público-Alvo
- Lojas de roupas de pequeno e médio porte
- Vendedores e caixas
- Administradores e gerentes
- Consultores de vendas

---

## ⚙️ ESPECIFICAÇÕES TÉCNICAS

### Stack Tecnológico

#### Frontend
- **Framework:** React 18.3.1
- **Linguagem:** TypeScript 5.5.3
- **Build Tool:** Vite 5.4.1
- **Roteamento:** React Router DOM 6.26.2
- **Estado Global:** Context API + React Query 5.56.2
- **Formulários:** React Hook Form 7.53.0 + Zod 3.23.8

#### UI/UX
- **Design System:** shadcn/ui
- **Styling:** Tailwind CSS 3.4.11
- **Ícones:** Lucide React 0.462.0
- **Componentes:** Radix UI
- **Animações:** Tailwind CSS Animate 1.0.7

#### Backend
- **Plataforma:** Supabase
- **Banco de Dados:** PostgreSQL
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

#### Ferramentas de Desenvolvimento
- **Linting:** ESLint 9.9.0
- **Type Checking:** TypeScript
- **Package Manager:** npm
- **Versionamento:** Git

### Requisitos do Sistema

#### Mínimos
- Node.js 18+
- npm 8+
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Conexão com internet

#### Recomendados
- Node.js 20+
- npm 9+
- 8GB RAM
- SSD para desenvolvimento

---

## 🏗️ ARQUITETURA DO SISTEMA

### Padrão Arquitetural
- **Frontend:** Single Page Application (SPA)
- **Backend:** Backend as a Service (BaaS) - Supabase
- **Estado:** Client-side com sincronização real-time

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── dashboard/      # Componentes do dashboard
│   ├── products/       # Componentes de produtos
│   ├── sales/          # Componentes de vendas
│   ├── returns/        # Componentes de devoluções
│   └── settings/       # Componentes de configurações
├── contexts/           # Contextos React (Auth, Store)
├── hooks/              # Hooks customizados
├── integrations/       # Integrações externas
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

### Fluxo de Dados
1. **Autenticação:** Supabase Auth → Context API
2. **Dados:** Supabase Database → React Query → Components
3. **Estado Local:** React Hooks → Components
4. **Real-time:** Supabase Realtime → Context API → Components

---

## 🚀 FUNCIONALIDADES

### 1. Sistema de Autenticação e Autorização

#### Perfis de Usuário
- **Admin:** Acesso total ao sistema
- **Vendedor:** Vendas e relatórios pessoais
- **Caixa:** Vendas e devoluções
- **Consultivo:** Apenas visualização

#### Controle de Permissões
- Controle granular por funcionalidade
- Middleware de proteção de rotas
- Validação de permissões em tempo real

### 2. Dashboard Administrativo

#### Métricas em Tempo Real
- Total de produtos e estoque baixo
- Número de clientes cadastrados
- Vendas e faturamento por período
- Ranking de vendedores

#### Filtros de Período
- Hoje, semana, mês, ano
- Período personalizado
- Análise temporal completa

### 3. Gestão de Produtos

#### Cadastro Completo
- Nome, descrição, preço, custo
- Categoria, coleção, fornecedor, marca
- Tamanho, cor, gênero, código de barras
- Imagem e controle de estoque

#### Funcionalidades Avançadas
- Importação em lote via XML
- Edição em massa
- Produtos temporários
- Histórico de exclusões
- Alertas de estoque baixo

### 4. Sistema de Vendas

#### Processo Completo
- Seleção de cliente (cadastrado ou genérico)
- Seleção de vendedor
- Adição de produtos com controle de estoque
- Aplicação de descontos (percentual ou valor)
- Múltiplos métodos de pagamento

#### Recursos Especiais
- Busca por código de barras
- Produtos temporários
- Confirmação de venda
- Agradecimento automático

### 5. Sistema de Devoluções e Trocas

#### Devoluções Parciais
- Devolver parte da quantidade comprada
- Controle automático de estoque
- Marcação de vendas como "Devolvida Parcialmente"
- Cálculo correto de valores

#### Tipos de Devolução
- Devolução simples (reembolso)
- Troca por outro produto
- Crédito da loja

#### Status e Motivos
- Status: Pendente, Aprovado, Rejeitado, Concluído
- Motivos: Defeituoso, Tamanho errado, Cor errada, Não gostou

### 6. Gestão de Clientes

#### Cadastro Completo
- Nome, WhatsApp, gênero, cidade
- Cliente genérico para vendas rápidas
- Histórico de compras
- Relacionamento com a loja

### 7. Relatórios e Analytics

#### Relatórios de Vendedores
- Performance individual
- Ranking de vendas
- Métricas por período
- Análise de produtividade

#### Minhas Vendas (Vendedores)
- Histórico pessoal
- Estatísticas diárias/mensais
- Agradecimento aos clientes
- Acompanhamento de performance

### 8. Configurações do Sistema

#### Configurações da Loja
- Nome, endereço, telefone
- Redes sociais
- Horário de funcionamento
- Logo da empresa

#### Notificações
- Alertas de estoque baixo
- Mensagens de agradecimento
- Configuração de canais (WhatsApp, email)
- Frequência de alertas

#### Segurança
- Políticas de senha
- Expiração de sessão
- Autenticação de dois fatores
- Controle de múltiplos logins

---

## 🗄️ BANCO DE DADOS

### Estrutura Principal

#### Tabelas Core
```sql
-- Produtos
products (id, name, description, price, cost_price, category, 
          collection, size, supplier, brand, quantity, image, 
          barcode, color, gender, created_at, updated_at)

-- Clientes
customers (id, name, whatsapp, gender, city, wanted_to_register, 
          is_generic, created_at, updated_at)

-- Vendas
sales (id, customer_id, subtotal, discount, discount_type, total, 
       payment_method, seller, cashier, date, created_at)

-- Itens de Venda
sale_items (id, sale_id, product_id, quantity, price, created_at)

-- Devoluções
returns (id, sale_id, customer_id, return_type, return_reason, 
         refund_method, notes, processed_by, status, refund_amount, 
         store_credit_amount, created_at, processed_at)

-- Itens Devolvidos
return_items (id, return_id, sale_item_id, product_id, quantity, 
              original_price, refund_price, condition_description, created_at)
```

#### Tabelas de Suporte
```sql
-- Usuários
users (id, name, email, phone, role, active, created_at, updated_at)

-- Vendedores
sellers (id, name, email, phone, active, created_at, updated_at)

-- Configurações
store_settings (id, name, address, phone, email, instagram, facebook, hours, logo)
notification_settings (id, low_stock_alert, low_stock_quantity, thank_you_message, ...)
security_settings (id, min_password_length, password_expiration, ...)
```

### Índices e Performance
- Índices em campos de busca frequente
- Índices em chaves estrangeiras
- Otimização para consultas de relatórios

### Triggers e Constraints
- Atualização automática de estoque
- Controle de integridade referencial
- Logs de auditoria
- Validações de negócio

---

## 🔌 API E INTEGRAÇÕES

### Supabase Client
```typescript
// Configuração
const supabase = createClient(supabaseUrl, supabaseKey)

// Operações principais
- Autenticação (signIn, signOut, signUp)
- CRUD de dados (select, insert, update, delete)
- Real-time subscriptions
- Storage operations
```

### Endpoints Principais

#### Autenticação
- `POST /auth/signin` - Login
- `POST /auth/signup` - Cadastro
- `POST /auth/signout` - Logout

#### Produtos
- `GET /products` - Listar produtos
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Excluir produto

#### Vendas
- `GET /sales` - Listar vendas
- `POST /sales` - Criar venda
- `GET /sales/:id` - Detalhes da venda

#### Devoluções
- `GET /returns` - Listar devoluções
- `POST /returns` - Criar devolução
- `PUT /returns/:id/approve` - Aprovar devolução
- `PUT /returns/:id/reject` - Rejeitar devolução

### Real-time Subscriptions
- Atualizações de estoque
- Novas vendas
- Status de devoluções
- Alertas de sistema

---

## 🎨 INTERFACE DO USUÁRIO

### Design System

#### Componentes Base (shadcn/ui)
- **Layout:** Card, Container, Grid
- **Formulários:** Input, Select, Textarea, Button
- **Navegação:** Sidebar, Menu, Breadcrumb
- **Feedback:** Toast, Alert, Dialog, Modal
- **Dados:** Table, Pagination, Search

#### Tema e Cores
```css
/* Cores principais */
--store-blue-600: #2563eb
--store-green-600: #16a34a
--store-red-600: #dc2626
--store-orange-600: #ea580c
```

#### Responsividade
- **Mobile First:** Design adaptativo
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navegação:** Sidebar colapsível em mobile

### Experiência do Usuário

#### Princípios
- **Simplicidade:** Interface limpa e intuitiva
- **Eficiência:** Fluxos otimizados para produtividade
- **Feedback:** Confirmações e estados visuais claros
- **Acessibilidade:** Suporte a navegação por teclado

#### Estados da Interface
- **Loading:** Skeleton loaders e spinners
- **Error:** Mensagens de erro claras
- **Success:** Confirmações de ações
- **Empty:** Estados vazios informativos

---

## 🔒 SEGURANÇA E AUTENTICAÇÃO

### Autenticação
- **Provider:** Supabase Auth
- **Métodos:** Email/Senha
- **Sessões:** JWT tokens
- **Refresh:** Tokens automáticos

### Autorização
- **RBAC:** Role-Based Access Control
- **Middleware:** Proteção de rotas
- **Validação:** Permissões em tempo real
- **Auditoria:** Logs de ações

### Segurança de Dados
- **HTTPS:** Comunicação criptografada
- **SQL Injection:** Prevenção via Supabase
- **XSS:** Sanitização de dados
- **CSRF:** Tokens de proteção

### Políticas de Senha
- Comprimento mínimo configurável
- Caracteres especiais opcionais
- Expiração de senha
- Histórico de senhas

---

## 🚀 DEPLOY E INFRAESTRUTURA

### Ambiente de Desenvolvimento
```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Ambiente de Produção
- **Hosting:** Vercel, Netlify, ou similar
- **Database:** Supabase (PostgreSQL)
- **CDN:** Distribuição global
- **SSL:** Certificado automático

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_ENV=production
```

### Monitoramento
- **Logs:** Console e Supabase logs
- **Performance:** Vite build analytics
- **Errors:** Error boundaries e try-catch
- **Uptime:** Health checks

---

## 👨‍💻 GUIA DE DESENVOLVIMENTO

### Configuração Inicial
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute as migrações do banco
5. Inicie o servidor: `npm run dev`

### Padrões de Código

#### Estrutura de Componentes
```typescript
// Componente funcional com TypeScript
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {
    // Lógica
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

#### Hooks Customizados
```typescript
// Padrão para hooks customizados
export const useCustomHook = () => {
  const [state, setState] = useState();
  
  const action = useCallback(() => {
    // Lógica
  }, []);
  
  return {
    state,
    action
  };
};
```

#### Context API
```typescript
// Padrão para contextos
interface ContextType {
  data: any;
  actions: {
    action1: () => void;
  };
}

const Context = createContext<ContextType | undefined>(undefined);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lógica do contexto
  
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};
```

### Testes
- **Unitários:** Jest + React Testing Library
- **E2E:** Playwright ou Cypress
- **Cobertura:** Mínimo 80%

### Performance
- **Code Splitting:** Lazy loading de rotas
- **Memoização:** React.memo, useMemo, useCallback
- **Bundle Size:** Análise com Vite bundle analyzer
- **Images:** Otimização e lazy loading

### Debugging
- **DevTools:** React DevTools
- **Logs:** Console.log estruturado
- **Network:** Supabase DevTools
- **State:** Redux DevTools (se aplicável)

---

## 📊 MÉTRICAS E KPIs

### Performance Técnica
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Métricas de Negócio
- **Vendas por período**
- **Produtividade por vendedor**
- **Taxa de devolução**
- **Satisfação do cliente**
- **Controle de estoque**

---

## 🔮 ROADMAP E MELHORIAS FUTURAS

### Curto Prazo (1-3 meses)
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp Business
- [ ] Relatórios avançados
- [ ] Backup automático

### Médio Prazo (3-6 meses)
- [ ] Multi-tenancy
- [ ] API pública
- [ ] Integração com marketplaces
- [ ] Sistema de fidelidade

### Longo Prazo (6+ meses)
- [ ] IA para previsão de vendas
- [ ] Integração com ERPs
- [ ] Marketplace próprio
- [ ] Sistema de franquias

---

## 📞 SUPORTE E CONTATO

### Documentação
- **README.md:** Guia rápido
- **DOCUMENTACAO_TECNICA.md:** Este documento
- **CHANGELOG.md:** Histórico de versões

### Comunicação
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** suporte@roupacerta.com

### Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025  
**Autor:** Equipe de Desenvolvimento  
**Licença:** MIT 