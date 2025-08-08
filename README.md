# 🛍️ ROUPA CERTA VENDAS PLUS

Sistema completo de gestão de vendas para lojas de roupas, desenvolvido com tecnologias modernas e focado em usabilidade e escalabilidade.

## 🚀 Funcionalidades Principais

### 📊 Dashboard Administrativo
- Métricas em tempo real
- Relatórios de vendas e performance
- Controle de estoque
- Ranking de vendedores

### 🛍️ Sistema de Vendas
- Processo completo de vendas
- Múltiplos métodos de pagamento
- Controle de estoque automático
- Produtos temporários
- Sistema de descontos

### 🔄 Devoluções e Trocas
- Devoluções parciais
- Controle automático de estoque
- Múltiplos tipos de reembolso
- Rastreamento completo

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Cliente genérico para vendas rápidas
- Histórico de compras
- Sistema de agradecimentos

### 📦 Gestão de Produtos
- Cadastro completo de produtos
- Importação em lote via XML
- Controle de estoque
- Edição em massa

### 🔐 Sistema de Usuários
- 4 perfis de acesso (Admin, Vendedor, Caixa, Consultivo)
- Controle granular de permissões
- Autenticação segura
- Auditoria de ações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **shadcn/ui** (Componentes)
- **Tailwind CSS** (Styling)
- **React Router** (Navegação)
- **React Query** (Estado)

### Backend
- **Supabase** (BaaS)
- **PostgreSQL** (Banco de dados)
- **Supabase Auth** (Autenticação)
- **Supabase Realtime** (Tempo real)

### Ferramentas
- **ESLint** (Linting)
- **Prettier** (Formatação)
- **Git** (Versionamento)

## 📋 Pré-requisitos

- Node.js 18+
- npm 8+
- Conta no Supabase
- Navegador moderno

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/roupa-certa-vendas-plus.git
cd roupa-certa-vendas-plus
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações do Supabase:
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. **Execute as migrações do banco**
```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: supabase/migrations/20250702151431-12c3222c-0c00-4b6b-b35c-8569daf1e9e0.sql
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:8081
```

## 📚 Documentação

- **[Documentação Técnica](DOCUMENTACAO_TECNICA.md)** - Especificações técnicas detalhadas
- **[Documentação Funcional](DOCUMENTACAO_FUNCIONAL.md)** - Funcionalidades e casos de uso
- **[Guia de Migração](supabase/migrations/)** - Scripts de banco de dados

## 🏗️ Estrutura do Projeto

```
roupa-certa-vendas-plus/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── dashboard/      # Componentes do dashboard
│   │   ├── products/       # Componentes de produtos
│   │   ├── sales/          # Componentes de vendas
│   │   ├── returns/        # Componentes de devoluções
│   │   └── settings/       # Componentes de configurações
│   ├── contexts/           # Contextos React (Auth, Store)
│   ├── hooks/              # Hooks customizados
│   ├── integrations/       # Integrações externas
│   ├── lib/                # Utilitários e configurações
│   ├── pages/              # Páginas da aplicação
│   ├── types/              # Definições TypeScript
│   └── utils/              # Funções utilitárias
├── supabase/
│   ├── migrations/         # Migrações do banco
│   └── config.toml         # Configuração do Supabase
├── public/                 # Arquivos estáticos
└── docs/                   # Documentação adicional
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
npm run lint             # Executa ESLint
```

## 🗄️ Banco de Dados

### Tabelas Principais
- `products` - Produtos com controle de estoque
- `customers` - Clientes cadastrados
- `sales` - Vendas realizadas
- `sale_items` - Itens de cada venda
- `returns` - Devoluções e trocas
- `return_items` - Itens devolvidos
- `users` - Usuários do sistema
- `sellers` - Vendedores externos

### Funcionalidades Avançadas
- Triggers para atualização automática de estoque
- Controle de integridade referencial
- Logs de auditoria
- Hash de arquivos XML importados

## 🔐 Autenticação e Autorização

### Perfis de Usuário
- **Admin:** Acesso total ao sistema
- **Vendedor:** Vendas e relatórios pessoais
- **Caixa:** Vendas e devoluções
- **Consultivo:** Apenas visualização

### Segurança
- Autenticação via Supabase Auth
- Controle granular de permissões
- Middleware de proteção de rotas
- Políticas de senha configuráveis

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

### Outros
O projeto pode ser deployado em qualquer plataforma que suporte aplicações React estáticas.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email:** suporte@roupacerta.com
- **Documentação:** [docs.roupacerta.com](https://docs.roupacerta.com)
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/roupa-certa-vendas-plus/issues)

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp Business
- [ ] Sistema de fidelidade
- [ ] Relatórios avançados
- [ ] Multi-tenancy

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Backup automático

---

**Desenvolvido com ❤️ pela equipe Roupa Certa**

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025
