'use client';

import React from 'react';
import { StoreItem, PWUserProfile } from '@/types/store';
import { Sparkles, Zap, ShieldCheck, Heart, Circle } from 'lucide-react';

interface DiscordProfileCardProps {
  user?: PWUserProfile;
  previewDecoration?: StoreItem | null;
  previewEffect?: StoreItem | null;
  previewNameplate?: StoreItem | null;
  className?: string;
}

export const DiscordProfileCard: React.FC<DiscordProfileCardProps> = ({
  user = {
    id: 'usr-demo',
    username: 'Capitão_PW',
    discriminator: '2026',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    bio: 'Administrador do PW • Criador de conteúdo & entusiasta do metaverso Discord.',
    customStatus: '🚀 Testando novos cosméticos no painel',
    status: 'online',
    coinsBalance: 3500,
    subscriptionTier: 'nitro_booster',
    badges: ['https://cdn-icons-png.flaticon.com/512/2583/2583344.png'],
    inventoryItemIds: [],
  },
  previewDecoration,
  previewEffect,
  previewNameplate,
  className = '',
}) => {
  const activeDec = previewDecoration !== undefined ? previewDecoration : user.activeDecoration;
  const activeEff = previewEffect !== undefined ? previewEffect : user.activeEffect;
  const activeNmp = previewNameplate !== undefined ? previewNameplate : user.activeNameplate;

  // Determine decoration visual animation class
  const getDecorationAnimClass = () => {
    if (!activeDec) return '';
    const animType = activeDec.config?.animationType;
    if (animType === 'flame') return 'animate-flame';
    if (animType === 'glow') return 'animate-glow';
    if (animType === 'sakura') return 'animate-sakura';
    return 'animate-glow';
  };

  // Determine effect banner style
  const getEffectBannerStyle = () => {
    if (!activeEff) return {};
    return {
      borderColor: activeEff.config?.accentColor || '#5865F2',
      boxShadow: activeEff.config?.accentColor
        ? `inset 0 0 40px ${activeEff.config.accentColor}44, 0 0 25px ${activeEff.config.accentColor}33`
        : undefined,
    };
  };

  // Status indicator colors
  const statusColors = {
    online: 'bg-[#23a55a]',
    idle: 'bg-[#f0b232]',
    dnd: 'bg-[#f23f43]',
    offline: 'bg-[#80848e]',
  };

  return (
    <div
      className={`w-full max-w-[340px] rounded-2xl bg-[#232428] text-[#dbdee1] shadow-2xl border border-[#383a40] overflow-hidden select-none transition-all ${className}`}
    >
      {/* BANNER WITH PROFILE EFFECT */}
      <div
        className="relative h-28 w-full bg-[#111214] bg-cover bg-center overflow-hidden border-b border-[#313338]"
        style={{
          backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined,
          ...getEffectBannerStyle(),
        }}
      >
        {/* Animated Profile Effect Overlay */}
        {activeEff && (
          <div className="absolute inset-0 pointer-events-none">
            {activeEff.config?.animationType === 'pulse' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-600/30 to-pink-500/20 animate-lightning" />
            )}
            {activeEff.config?.animationType === 'sakura' && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/30 via-rose-900/10 to-transparent animate-sakura" />
            )}
            {activeEff.config?.animationType === 'sparkle' && (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-fuchsia-500/20 to-purple-800/40 animate-pulse" />
            )}

            {/* Effect Badge Indicator */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{activeEff.title}</span>
            </div>
          </div>
        )}

        {/* Discord Nitro Booster Badge in Banner */}
        {user.subscriptionTier && user.subscriptionTier !== 'none' && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#f47fff] to-[#8045ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            <span>NITRO</span>
          </div>
        )}
      </div>

      {/* AVATAR SECTION WITH DECORATION */}
      <div className="px-4 relative pb-4">
        <div className="relative -mt-12 mb-3 inline-block">
          {/* Avatar Container */}
          <div className="relative w-20 h-20 rounded-full p-[5px] bg-[#232428] flex items-center justify-center">
            {/* Base Avatar Image */}
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full rounded-full object-cover bg-[#1e1f22]"
            />

            {/* Avatar Decoration Overlay */}
            {activeDec && (
              <div
                className={`absolute -inset-[10px] pointer-events-none rounded-full flex items-center justify-center z-10 ${getDecorationAnimClass()}`}
              >
                {/* SVG Frame or Dynamic Image Decoration */}
                <div
                  className="w-full h-full rounded-full border-4 border-dashed"
                  style={{
                    borderColor: activeDec.config?.gradientColors?.[0] || '#5865F2',
                    boxShadow: `0 0 15px ${activeDec.config?.gradientColors?.[0] || '#5865F2'}`,
                    backgroundImage: `linear-gradient(45deg, ${activeDec.config?.gradientColors?.[0] || '#5865F2'}33, ${activeDec.config?.gradientColors?.[1] || '#F47FFF'}44)`,
                  }}
                />
                {/* Decoration Icon Floating Header */}
                <div className="absolute -top-1 bg-[#1e1f22] border border-[#5865F2] rounded-full p-1 text-[8px] text-[#f47fff]">
                  ✨
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div
              className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-[3.5px] border-[#232428] ${statusColors[user.status]} z-20 flex items-center justify-center`}
              title={`Status: ${user.status}`}
            />
          </div>
        </div>

        {/* USERNAME & NAMEPLATE */}
        <div className="bg-[#111214] p-3 rounded-xl border border-[#313338]/60 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-lg font-bold tracking-tight inline-block"
                style={
                  activeNmp?.config?.gradientColors
                    ? {
                        background: `linear-gradient(90deg, ${activeNmp.config.gradientColors[0]}, ${activeNmp.config.gradientColors[1]})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.2))',
                      }
                    : { color: '#f2f3f5' }
                }
              >
                {user.username}
              </h3>
              <span className="text-xs text-[#949ba4] font-medium ml-1">#{user.discriminator}</span>
            </div>

            {/* Badges Bar */}
            <div className="flex items-center gap-1 bg-[#1e1f22] px-2 py-1 rounded-lg border border-[#2b2d31]">
              <span title="Apoiador PW" className="text-sm">💎</span>
              <span title="Assinante Nitro" className="text-sm">🚀</span>
              <span title="Desenvolvedor" className="text-sm">🛡️</span>
            </div>
          </div>

          {/* Custom Status Bubble */}
          {user.customStatus && (
            <div className="mt-2 text-xs text-[#dbdee1] bg-[#1e1f22] px-2.5 py-1 rounded-md border border-[#2b2d31] flex items-center gap-1.5">
              <span className="truncate">{user.customStatus}</span>
            </div>
          )}
        </div>

        {/* ABOUT ME / BIO */}
        <div className="bg-[#111214] p-3 rounded-xl border border-[#313338]/60 mb-3 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#949ba4] block mb-1">
            Sobre Mim
          </span>
          <p className="text-[#dbdee1] leading-relaxed">{user.bio}</p>

          <div className="mt-3 pt-2 border-t border-[#2b2d31] flex justify-between items-center text-[11px] text-[#949ba4]">
            <span>Saldo PW Coins:</span>
            <span className="font-bold text-[#f0b232] flex items-center gap-1">
              🪙 {user.coinsBalance.toLocaleString('pt-BR')} Coins
            </span>
          </div>
        </div>

        {/* ROLES / CARGOS */}
        <div className="bg-[#111214] p-3 rounded-xl border border-[#313338]/60 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#949ba4] block mb-1.5">
            Cargos do PW
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/40 text-[11px] font-medium">
              <Circle className="w-2 h-2 fill-current" /> Admin PW
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f47fff]/20 text-[#f47fff] border border-[#f47fff]/40 text-[11px] font-medium">
              <Circle className="w-2 h-2 fill-current" /> Nitro Booster
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f0b232]/20 text-[#f0b232] border border-[#f0b232]/40 text-[11px] font-medium">
              <Circle className="w-2 h-2 fill-current" /> Dono de Servidor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
