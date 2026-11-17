# GUIA DE TRANSICAO PARA A PROXIMA IA / DESENVOLVEDOR (AI HANDOFF)

> **Documento de Contexto Geral do Projeto: `paineladminpw`**  
> **Repositorio Oficial:** `https://github.com/COprivacy/paineladminpw.git`  
> **Caminho Local do Workspace:** `C:\Users\carla\.gemini\antigravity\scratch\paineladminpw`  
> **Ultima Atualizacao:** 17 de Novembro de 2026

---

## 1. O que e este projeto? (Visao Geral)

O **PW** e uma aplicacao de comunicacao por voz, texto e video similar ao **Discord**.  
Este repositorio (`paineladminpw`) e o **Painel Administrativo da Loja Oficial do PW**, criado de forma desacoplada do projeto principal, porem integrado via banco de dados e mensageria:

- **Banco de Dados & Storage:** Hospedado no **Supabase** (PostgreSQL + Buckets de armazenamento de imagens/animacoes).
- **Servidor do Aplicativo PW:** Hospedado no **Firebase** (Cloud Functions, Realtime DB / Firestore).
- **Tema Visual:** **Discord Dark Theme autêntico**, com sidebar em formato de servidores, canais (`# loja-catalogo`, `# molduras-avatar`), e um **card de perfil ao vivo (Live Discord Profile Card)** para testar cosmeticos em tempo real sem qualquer emoji ou icone de IA.

---

## 2. O que JA FOI FEITO (Estado Atual)

### 2.1 Stack & Infraestrutura Base
- **Next.js 16 (App Router)** com **React 19**, **TypeScript** e **Tailwind CSS**.
- Build de producao verificado com **0 erros** de compilacao ou de tipos TypeScript.
- Servidor de desenvolvimento rodando em segundo plano em `http://localhost:3000`.
- Icones profissionais da biblioteca **Lucide Icons** (zero emojis, zero icones de estrelas/IA).

### 2.2 Banco de Dados Supabase (PostgreSQL & Storage)
- **Script DDL Criado em `supabase/schema.sql`:**
  - `public.store_items`: Armazena todos os cosméticos (molduras, efeitos, insígnias, nameplates, pacotes de moedas, bundles), raridades (`common`, `rare`, `epic`, `legendary`, `mythic`), preços em R$ e em moedas do PW (`price_coins`), URLs de assets e JSONB de configurações visuais.
  - `public.subscription_plans`: Planos estilo Discord Nitro (`nitro_basic`, `nitro_booster`, `nitro_ultimate`), bônus mensal de moedas e lista de benefícios (perks).
  - `public.user_profiles`: Perfis de usuários do PW sincronizados (avatar, banner, moedas, status online/idle/dnd, cosméticos atualmente equipados).
  - `public.user_inventory`: Tabela de inventário vinculando `user_id` e `item_id`, com origem (`purchase`, `gift`, `admin`) e expiração se for temporário.
  - `public.store_orders`: Log de transações com método de pagamento (Pix, cartão, coins, admin_grant).
  - `public.store_banners`: Carrossel de banners de coleções em destaque na loja.
  - Políticas de **Row Level Security (RLS)** configuradas para leitura pública do catálogo e escrita total apenas com `service_role`.
  - Bucket de armazenamento criado: `pw-shop-assets`.
- **Script Seed Criado em `supabase/seed.sql`:**
  - Coleção Cyberpunk, Moldura Katana Neon, Fogo Infernal, Sakuras Místicas, Tempestade de Raios, Nameplate Ouro 24k, Badges de Apoiador Alfa, etc.

### 2.3 Interface do Usuário (Discord Dark Theme & Ícones Profissionais)
- **`src/app/globals.css`:** Variáveis de cores autênticas do Discord (`#313338`, `#2b2d31`, `#1e1f22`, `#5865F2`, `#F47FFF`, `#23A55A`, `#F0B232`), scrollbars customizadas e animações CSS (`animate-flame`, `animate-glow`, `animate-sakura`, `animate-lightning`).
- **`src/components/preview/DiscordProfileCard.tsx`:** Componente pixel-perfect do perfil do Discord. Renderiza ao vivo o avatar, a moldura animada, o banner com o efeito de perfil ativado, nameplate com gradiente de texto, insígnias profissionais (`Gem`, `Zap`, `ShieldCheck`), bio e cargos.
- **`src/components/layout/DiscordSidebar.tsx`:** Trilho lateral esquerdo do servidor PW + lista de canais de navegação e barra de usuário inferior.
- **`src/components/products/ProductModal.tsx`:** Modal completo para criar e editar qualquer tipo de produto (preços em R$ e PW Coins com ícone `Coins`, raridade, tipo de animação, cores primárias/secundárias e botão de teste direto no preview).
- **`src/components/users/GrantItemModal.tsx`:** Modal para o administrador conceder itens ou moedas diretamente no inventário de qualquer usuário do PW.

### 2.4 Integração & Sincronização
- **`src/lib/supabase.ts`:** Cliente Supabase resiliente. Funciona com as credenciais reais do `.env.local` e faz fallback transparente para mock data caso as chaves ainda não tenham sido inseridas pelo usuário.
- **`src/lib/firebase-sync.ts` & `src/app/api/sync-pw/route.ts`:** Sistema de Webhook que envia requisições `POST` com token Bearer (`PW_SYNC_SECRET`) para o backend Firebase do PW notificar clientes via WebSocket.
- **`src/lib/mock-data.ts`:** Catálogo de teste rico para desenvolvimento imediato sem qualquer caractere emoji.

---

## 3. Estrutura de Arquivos do Projeto

```
paineladminpw/
├── .env.example                     # Modelo das variáveis de ambiente necessárias
├── .env.local                       # Arquivo local com as chaves (ignorado pelo git)
├── AI_HANDOFF.md                    # ESTE ARQUIVO: Contexto completo para a próxima IA
├── README.md                        # Guia de instalação e documentação do projeto
├── package.json                     # Next.js 16, React 19, Supabase JS, Lucide-react
├── supabase/
│   ├── schema.sql                   # SQL de criação das tabelas, RLS e Storage
│   └── seed.sql                     # SQL com itens iniciais da loja estilo Discord
└── src/
    ├── app/
    │   ├── api/sync-pw/route.ts     # Endpoint de teste de ping e disparo de sincronização
    │   ├── globals.css              # Tema Discord Dark e animações de cosméticos
    │   ├── layout.tsx               # Metadados e wrapper HTML
    │   └── page.tsx                 # Página principal com todas as abas e Live Preview
    ├── components/
    │   ├── common/RarityBadge.tsx   # Badge visual de raridade (Comum, Raro, Épico, Lendário, Mítico)
    │   ├── layout/DiscordSidebar.tsx # Sidebar estilo Discord (Canais e Servidor)
    │   ├── preview/DiscordProfileCard.tsx # Preview ao vivo do perfil com cosméticos
    │   ├── products/ProductModal.tsx # Modal de criação/edição de produtos
    │   └── users/GrantItemModal.tsx # Modal para conceder cosméticos ou coins a usuários
    ├── lib/
    │   ├── firebase-sync.ts         # Despachante de webhook para o Firebase do PW
    │   ├── mock-data.ts             # Dados mock para demonstração offline
    │   └── supabase.ts              # Conexão oficial com o Supabase
    └── types/
        └── store.ts                 # Interfaces TypeScript de todos os produtos e payloads
```

---

## 4. O QUE AINDA PRECISA SER FEITO (Roadmap / Próximos Passos)

Se o usuário pedir continuidade, aqui está a lista de tarefas prioritárias:

### Prioridade 1: Executar o Banco no Supabase do Usuário
- O usuário precisa ir até o painel do Supabase ([supabase.com/dashboard](https://supabase.com/dashboard)), abrir o **SQL Editor** e rodar:
  1. `supabase/schema.sql` (Criação de tabelas, índices e RLS).
  2. `supabase/seed.sql` (Popula a loja com itens iniciais).
- Em seguida, preencher no `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
  SUPABASE_SERVICE_ROLE_KEY=ey...
  ```

### Prioridade 2: Upload Direto de Arquivos para o Supabase Storage
- Atualmente, o `ProductModal.tsx` recebe a URL da imagem/animação via input de texto.
- Adicionar upload direto drag-and-drop para o bucket `pw-shop-assets` via `supabase.storage.from('pw-shop-assets').upload(...)`.

### Prioridade 3: Configurar o Receptor no Firebase do PW
- No backend do PW (no Firebase), criar uma Cloud Function HTTP para escutar o webhook `POST /onShopSync` e emitir evento via WebSocket / Firebase Realtime DB para os clientes conectados.

### Prioridade 4: Autenticação de Administrador (Login Gate)
- Criar tela de login (`/login`) usando **Supabase Auth** (`supabase.auth.signInWithPassword`), protegendo o acesso ao painel.

### Prioridade 5: Integração com Gateway de Pagamento Real (Opcional)
- Integrar Mercado Pago (Pix automático com QR Code) ou Stripe para checkout de PW Coins e Nitro.
