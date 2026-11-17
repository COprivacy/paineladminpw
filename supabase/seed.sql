-- ==============================================================================
-- DADOS INICIAIS (SEED) - COSMÉTICOS COMPLETOS ESTILO DISCORD SHOP
-- ==============================================================================

-- 1. PLANOS NITRO (ASSINATURAS VIP)
INSERT INTO public.subscription_plans (id, name, badge_name, badge_icon, monthly_price_brl, yearly_price_brl, monthly_coins_bonus, color, perks)
VALUES
(
    'nitro_basic',
    'PW Nitro Basic',
    'Assinante Basic',
    'zap',
    14.90,
    149.00,
    300,
    '#5865F2',
    '["Uploads de até 50MB", "Usar emojis personalizados em qualquer servidor", "Insígnia especial no perfil", "Desconto de 10% na Loja PW"]'::jsonb
),
(
    'nitro_booster',
    'PW Nitro Booster',
    'Apoiador Nitro',
    'award',
    29.90,
    299.00,
    800,
    '#F47FFF',
    '["Uploads de até 500MB", "Streaming em 4K 60FPS", "2 Impulsos de Servidor (Boosts) inclusos", "Desconto de 20% na Loja PW", "Acesso antecipado a cosméticos exclusivos", "Efeito de perfil animado exclusivo"]'::jsonb
),
(
    'nitro_ultimate',
    'PW Nitro Ultimate',
    'Membro Lendário',
    'crown',
    49.90,
    499.00,
    2000,
    '#F0B232',
    '["Uploads Ilimitados", "5 Impulsos de Servidor", "Moldura de Avatar Dourada Exclusiva", "Cargos e cores com gradiente RGB", "Prioridade máxima de suporte", "Desconto de 30% na Loja PW"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    badge_name = EXCLUDED.badge_name,
    badge_icon = EXCLUDED.badge_icon,
    monthly_price_brl = EXCLUDED.monthly_price_brl,
    yearly_price_brl = EXCLUDED.yearly_price_brl,
    monthly_coins_bonus = EXCLUDED.monthly_coins_bonus,
    color = EXCLUDED.color,
    perks = EXCLUDED.perks;

-- 2. MOLDURAS DE AVATAR (AVATAR DECORATIONS)
INSERT INTO public.store_items (title, description, category, rarity, price_brl, price_coins, asset_url, preview_url, config, is_limited, featured)
VALUES
(
    'Katana Cyberpunk Neon',
    'Espadas cibernéticas cruzadas que pulsam em tons de azul e roxo elétrico.',
    'avatar_decoration',
    'legendary',
    24.90,
    750,
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
    '{"animationType": "glow", "gradientColors": ["#5865F2", "#F47FFF"], "tag": "Cyberpunk"}'::jsonb,
    true,
    true
),
(
    'Chamas do Dragão Infernal',
    'Fogo cósmico animado subindo pelas bordas do avatar.',
    'avatar_decoration',
    'epic',
    19.90,
    600,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300',
    '{"animationType": "flame", "gradientColors": ["#FF4500", "#FFD700"], "tag": "Fantasia"}'::jsonb,
    false,
    true
),
(
    'Coroa de Cerejeira Mística',
    'Pétalas de Sakura voando delicadamente ao redor do avatar.',
    'avatar_decoration',
    'rare',
    14.90,
    450,
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300',
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300',
    '{"animationType": "wave", "gradientColors": ["#FFB7B2", "#FF69B4"], "tag": "Primavera"}'::jsonb,
    false,
    false
),
(
    'Chifres Demoníacos Carmesim',
    'Chifres imponentes com pontas incandescentes e fumaça escura.',
    'avatar_decoration',
    'epic',
    19.90,
    600,
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300',
    '{"animationType": "pulse", "gradientColors": ["#8B0000", "#FF0000"], "tag": "Gótico"}'::jsonb,
    false,
    false
);

-- 3. EFEITOS DE PERFIL (PROFILE EFFECTS)
INSERT INTO public.store_items (title, description, category, rarity, price_brl, price_coins, asset_url, preview_url, config, is_limited, featured)
VALUES
(
    'Tempestade de Raios Elétricos',
    'Relâmpagos azuis e violetas que cortam o banner quando o perfil é inspecionado.',
    'profile_effect',
    'legendary',
    29.90,
    900,
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=500',
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=500',
    '{"animationType": "pulse", "bannerColor": "#0b0e14", "accentColor": "#5865F2"}'::jsonb,
    true,
    true
),
(
    'Chuva de Sakuras Japonesas',
    'Cascata contínua de pétalas cor-de-rosa flutuando sobre o perfil.',
    'profile_effect',
    'rare',
    16.90,
    500,
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500',
    '{"animationType": "wave", "bannerColor": "#2b101c", "accentColor": "#ff73fa"}'::jsonb,
    false,
    false
),
(
    'Explosão Cósmica Supernova',
    'Uma nebulosa estelar em rotação que pulsa poeira galáctica brilhante.',
    'profile_effect',
    'mythic',
    39.90,
    1200,
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500',
    '{"animationType": "glow", "bannerColor": "#050014", "accentColor": "#8045ff"}'::jsonb,
    true,
    true
);

-- 4. INSÍGNIAS (BADGES)
INSERT INTO public.store_items (title, description, category, rarity, price_brl, price_coins, asset_url, preview_url, config, is_limited, featured)
VALUES
(
    'Insígnia: Apoiador Alfa PW',
    'Insígnia dourada concedida aos primeiros usuários e investidores do ecossistema PW.',
    'badge',
    'mythic',
    49.90,
    1500,
    'https://cdn-icons-png.flaticon.com/512/2583/2583344.png',
    'https://cdn-icons-png.flaticon.com/512/2583/2583344.png',
    '{"tag": "Colecionador", "nitroExclusive": false}'::jsonb,
    true,
    true
),
(
    'Insígnia: Caçador de Bugs',
    'Dada a usuários que reportaram falhas de segurança e melhorias no aplicativo.',
    'badge',
    'legendary',
    0.00,
    0,
    'https://cdn-icons-png.flaticon.com/512/606/606260.png',
    'https://cdn-icons-png.flaticon.com/512/606/606260.png',
    '{"tag": "Conquista", "adminOnly": true}'::jsonb,
    false,
    false
);

-- 5. NAMEPLATES / ESTILOS DE NOME
INSERT INTO public.store_items (title, description, category, rarity, price_brl, price_coins, asset_url, preview_url, config, is_limited, featured)
VALUES
(
    'Gradiente Holográfico Neon',
    'Seu apelido no chat e no perfil ganha um brilho metálico que muda suavemente de tom.',
    'nameplate',
    'epic',
    12.90,
    400,
    'linear-gradient(90deg, #ff007f, #00f0ff)',
    'linear-gradient(90deg, #ff007f, #00f0ff)',
    '{"gradientColors": ["#ff007f", "#00f0ff"]}'::jsonb,
    false,
    true
),
(
    'Ouro Imperial Maciço 24K',
    'Nome dourado com efeito de brilho e reflexo de luz periódica.',
    'nameplate',
    'legendary',
    22.90,
    700,
    'linear-gradient(90deg, #ffe066, #f0b232)',
    'linear-gradient(90deg, #ffe066, #f0b232)',
    '{"gradientColors": ["#ffe066", "#f0b232"]}'::jsonb,
    true,
    false
);

-- 6. PACOTES DE MOEDAS (PW COINS)
INSERT INTO public.store_items (title, description, category, rarity, price_brl, price_coins, asset_url, preview_url, config, is_limited, featured)
VALUES
(
    'Pacote Pequeno: 500 PW Coins',
    'Ideal para adquirir sua primeira moldura ou insígnia na loja.',
    'coin_pack',
    'common',
    9.90,
    500,
    'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    '{"coinsAmount": 500, "coinsBonusPercent": 0}'::jsonb,
    false,
    false
),
(
    'Pacote Gamer: 1.250 PW Coins (+25% Bônus)',
    'O pacote mais popular! Compre até 2 itens épicos e economize.',
    'coin_pack',
    'rare',
    19.90,
    1250,
    'https://cdn-icons-png.flaticon.com/512/217/217853.png',
    'https://cdn-icons-png.flaticon.com/512/217/217853.png',
    '{"coinsAmount": 1250, "coinsBonusPercent": 25}'::jsonb,
    false,
    true
),
(
    'Cofre do Dragão: 5.000 PW Coins (+45% Bônus)',
    'Para quem quer colecionar todos os itens e apoiar o desenvolvimento do PW.',
    'coin_pack',
    'legendary',
    69.90,
    5000,
    'https://cdn-icons-png.flaticon.com/512/3135/3135706.png',
    'https://cdn-icons-png.flaticon.com/512/3135/3135706.png',
    '{"coinsAmount": 5000, "coinsBonusPercent": 45}'::jsonb,
    false,
    true
);

-- 7. PACOTES COMBINADOS (BUNDLES)
INSERT INTO public.store_items (title, description, category, rarity, price_brl, price_coins, asset_url, preview_url, config, is_limited, featured)
VALUES
(
    'Bundle Cyberpunk Supremo (Moldura + Efeito + Nameplate)',
    'O kit completo do futuro distópico com 40% de desconto em relação aos itens avulsos.',
    'bundle',
    'legendary',
    49.90,
    1500,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    '{"perksList": ["Moldura Katana Neon", "Efeito Tempestade Elétrica", "Nameplate Holográfico", "Desconto especial de lançamento"]}'::jsonb,
    true,
    true
);

-- 8. BANNERS PROMOCIONAIS DA LOJA
INSERT INTO public.store_banners (title, subtitle, banner_image_url, cta_text, target_category, display_order)
VALUES
(
    'Coleção Cyberpunk 2099',
    'Personalize seu perfil com molduras animadas e efeitos holográficos.',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
    'Explorar Coleção',
    'avatar_decoration',
    1
),
(
    'Chegou o PW Nitro Booster',
    'Tenha 500MB de upload, 2 boosts de servidor e cosméticos exclusivos.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
    'Assinar Agora',
    'subscription',
    2
);

