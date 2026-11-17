export type ProductCategory =
  | 'avatar_decoration'
  | 'profile_effect'
  | 'badge'
  | 'nameplate'
  | 'profile_theme'
  | 'subscription'
  | 'coin_pack'
  | 'bundle';

export type ProductRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface StoreItem {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  rarity: ProductRarity;
  priceBRL: number; // Ex: 19.90
  priceCoins: number; // Ex: 450
  assetUrl: string; // URL do APNG/GIF/WebP ou MP4/WebM
  previewUrl: string; // Thumbnail para o card da loja
  badgeIconUrl?: string; // Se for badge
  config?: {
    bannerColor?: string;
    accentColor?: string;
    gradientColors?: [string, string];
    animationType?: 'glow' | 'flame' | 'pulse' | 'wave' | 'matrix';
    tag?: string;
    nitroExclusive?: boolean;
    serverBoostPerk?: boolean;
    coinsAmount?: number;
    coinsBonusPercent?: number;
    bundleItemIds?: string[];
    perksList?: string[];
  };
  isLimited: boolean;
  availableUntil?: string | null;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  badgeName: string;
  badgeIcon: string;
  monthlyPriceBRL: number;
  yearlyPriceBRL: number;
  monthlyCoinsBonus: number;
  color: string;
  perks: string[];
  isActive: boolean;
}

export interface PWUserProfile {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  customStatus?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  coinsBalance: number;
  subscriptionTier?: string; // 'none' | 'nitro_basic' | 'nitro_booster' | 'nitro_ultimate'
  activeDecoration?: StoreItem | null;
  activeEffect?: StoreItem | null;
  activeNameplate?: StoreItem | null;
  badges: string[]; // URLs or IDs
  inventoryItemIds: string[];
}

export interface StoreOrder {
  id: string;
  userId: string;
  username: string;
  itemId: string;
  itemTitle: string;
  category: ProductCategory;
  amountBRL: number;
  amountCoins: number;
  paymentMethod: 'pix' | 'credit_card' | 'coins' | 'admin_grant';
  status: 'completed' | 'pending' | 'refunded';
  createdAt: string;
}

export interface SyncPayload {
  action: 'ITEM_CREATED' | 'ITEM_UPDATED' | 'ITEM_DELETED' | 'INVENTORY_GRANTED' | 'INVENTORY_REVOKED';
  timestamp: string;
  targetId: string;
  data: any;
  secret: string;
}
