-- ==============================================================================
-- PW SHOP & ADMIN PANEL - SUPABASE DATABASE SCHEMA
-- Compatível com PostgreSQL / Supabase
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PRODUTOS DA LOJA (COSMÉTICOS, MOEDAS, ASSINATURAS, ETC.)
CREATE TABLE IF NOT EXISTS public.store_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'avatar_decoration',
        'profile_effect',
        'badge',
        'nameplate',
        'profile_theme',
        'subscription',
        'coin_pack',
        'bundle'
    )),
    rarity VARCHAR(20) NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    price_brl NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_coins INTEGER NOT NULL DEFAULT 0,
    asset_url TEXT NOT NULL,         -- Arquivo principal (APNG, WebP, Lottie, WebM ou PNG)
    preview_url TEXT NOT NULL,       -- Miniatura / Thumbnail
    badge_icon_url TEXT,             -- Ícone caso seja badge
    config JSONB DEFAULT '{}'::jsonb, -- Configurações visuais (cores, partículas, bônus, etc.)
    is_limited BOOLEAN NOT NULL DEFAULT FALSE,
    available_until TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA DE PLANOS DE ASSINATURA (ESTILO NITRO)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id VARCHAR(50) PRIMARY KEY, -- ex: 'nitro_basic', 'nitro_booster', 'nitro_ultimate'
    name VARCHAR(100) NOT NULL,
    badge_name VARCHAR(100),
    badge_icon TEXT,
    monthly_price_brl NUMERIC(10, 2) NOT NULL,
    yearly_price_brl NUMERIC(10, 2) NOT NULL,
    monthly_coins_bonus INTEGER NOT NULL DEFAULT 0,
    color VARCHAR(30) DEFAULT '#5865F2',
    perks JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABELA DE PERFIL DE USUÁRIOS DO PW (SINCRONIZADO DO FIREBASE/SUPABASE AUTH)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY, -- ID correspondente ao usuário no PW / Auth
    username VARCHAR(100) NOT NULL,
    discriminator VARCHAR(10) DEFAULT '0001',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    banner_url TEXT,
    bio TEXT DEFAULT 'Olá! Estou usando o PW.',
    custom_status TEXT,
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'idle', 'dnd', 'offline')),
    coins_balance INTEGER NOT NULL DEFAULT 0,
    subscription_tier VARCHAR(50) REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    active_decoration_id UUID REFERENCES public.store_items(id) ON DELETE SET NULL,
    active_effect_id UUID REFERENCES public.store_items(id) ON DELETE SET NULL,
    active_nameplate_id UUID REFERENCES public.store_items(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABELA DE INVENTÁRIO DO USUÁRIO (ITENS QUE O USUÁRIO POSSUI)
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
    source VARCHAR(30) NOT NULL DEFAULT 'purchase' CHECK (source IN ('purchase', 'gift', 'admin', 'subscription_perk')),
    acquired_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ, -- Nulo para itens permanentes
    UNIQUE(user_id, item_id)
);

-- 6. TABELA DE PEDIDOS / TRANSAÇÕES DA LOJA
CREATE TABLE IF NOT EXISTS public.store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
    amount_brl NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    amount_coins INTEGER NOT NULL DEFAULT 0,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'coins', 'admin_grant')),
    status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'refunded', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABELA DE BANNERS E DESTAQUES DA LOJA NO PW (CARROSSEL SUPERIOR ESTILO DISCORD)
CREATE TABLE IF NOT EXISTS public.store_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    banner_image_url TEXT NOT NULL,
    cta_text VARCHAR(50) DEFAULT 'Ver Coleção',
    target_category VARCHAR(50),
    target_item_id UUID REFERENCES public.store_items(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TRIGGER DE ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_store_items_modtime
    BEFORE UPDATE ON public.store_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_modtime
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. CONFIGURAÇÃO DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_banners ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública para Catálogo da Loja
CREATE POLICY "Catálogo da loja visível para todos" ON public.store_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Planos de assinatura visíveis para todos" ON public.subscription_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Banners visíveis para todos" ON public.store_banners
    FOR SELECT USING (is_active = true);

-- Políticas de Controle Total para a Chave de Serviço (Admin Panel)
CREATE POLICY "Service Role acesso total store_items" ON public.store_items
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service Role acesso total subscriptions" ON public.subscription_plans
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service Role acesso total user_profiles" ON public.user_profiles
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service Role acesso total user_inventory" ON public.user_inventory
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service Role acesso total store_orders" ON public.store_orders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service Role acesso total store_banners" ON public.store_banners
    FOR ALL USING (auth.role() = 'service_role');

-- 10. CRIAÇÃO DE BUCKET DE ARMAZENAMENTO NO SUPABASE STORAGE (Para imagens e animações)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pw-shop-assets', 'pw-shop-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Assets da loja são públicos" ON storage.objects
    FOR SELECT USING (bucket_id = 'pw-shop-assets');

CREATE POLICY "Apenas admins podem fazer upload de assets" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'pw-shop-assets' AND auth.role() = 'service_role');

