import { createClient } from '@supabase/supabase-js';
import { ProductCategory, ProductRarity, StoreItem } from '@/types/store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
};

// Cliente para o navegador ou requisições gerais
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  : null;

// Cliente seguro com permissão de Admin (Service Role)
export const getAdminSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// ==============================================================================
// MAPPER BIDIRECIONAL: SUPABASE (snake_case) <-> FRONTEND (camelCase)
// ==============================================================================

export interface StoreItemDBRow {
  id?: string;
  title?: string;
  description?: string | null;
  category?: ProductCategory;
  rarity?: ProductRarity;
  price_brl?: number | string | null;
  price_coins?: number | null;
  asset_url?: string | null;
  preview_url?: string | null;
  badge_icon_url?: string | null;
  config?: StoreItem['config'] | null;
  is_limited?: boolean | null;
  available_until?: string | null;
  is_active?: boolean | null;
  featured?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export function mapStoreItemFromDB(row: StoreItemDBRow): StoreItem {
  return {
    id: row.id || '',
    title: row.title || '',
    description: row.description || '',
    category: row.category || 'avatar_decoration',
    rarity: row.rarity || 'common',
    priceBRL: typeof row.price_brl === 'number' ? row.price_brl : parseFloat(String(row.price_brl || '0')),
    priceCoins: row.price_coins || 0,
    assetUrl: row.asset_url || '',
    previewUrl: row.preview_url || row.asset_url || '',
    badgeIconUrl: row.badge_icon_url || undefined,
    config: row.config || {},
    isLimited: Boolean(row.is_limited),
    availableUntil: row.available_until || null,
    isActive: row.is_active !== undefined && row.is_active !== null ? Boolean(row.is_active) : true,
    featured: Boolean(row.featured),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapStoreItemToDB(item: Partial<StoreItem>): StoreItemDBRow {
  const dbRow: StoreItemDBRow = {};

  if (item.id) dbRow.id = item.id;
  if (item.title !== undefined) dbRow.title = item.title;
  if (item.description !== undefined) dbRow.description = item.description;
  if (item.category !== undefined) dbRow.category = item.category;
  if (item.rarity !== undefined) dbRow.rarity = item.rarity;
  if (item.priceBRL !== undefined) dbRow.price_brl = item.priceBRL;
  if (item.priceCoins !== undefined) dbRow.price_coins = item.priceCoins;
  if (item.assetUrl !== undefined) dbRow.asset_url = item.assetUrl;
  if (item.previewUrl !== undefined) dbRow.preview_url = item.previewUrl;
  if (item.badgeIconUrl !== undefined) dbRow.badge_icon_url = item.badgeIconUrl;
  if (item.config !== undefined) dbRow.config = item.config;
  if (item.isLimited !== undefined) dbRow.is_limited = item.isLimited;
  if (item.availableUntil !== undefined) dbRow.available_until = item.availableUntil || null;
  if (item.isActive !== undefined) dbRow.is_active = item.isActive;
  if (item.featured !== undefined) dbRow.featured = item.featured;

  return dbRow;
}
