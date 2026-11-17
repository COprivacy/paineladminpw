import React from 'react';
import { ProductRarity } from '@/types/store';

interface RarityBadgeProps {
  rarity: ProductRarity;
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, className = '' }) => {
  const config = {
    common: {
      label: 'Comum',
      bg: 'bg-zinc-800',
      text: 'text-zinc-300',
      border: 'border-zinc-700',
    },
    rare: {
      label: 'Raro',
      bg: 'bg-blue-950/70',
      text: 'text-blue-400',
      border: 'border-blue-500/40',
    },
    epic: {
      label: 'Épico',
      bg: 'bg-purple-950/70',
      text: 'text-purple-300',
      border: 'border-purple-500/50',
    },
    legendary: {
      label: 'Lendário',
      bg: 'bg-amber-950/70',
      text: 'text-amber-300',
      border: 'border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    },
    mythic: {
      label: 'Mítico',
      bg: 'bg-rose-950/70',
      text: 'text-rose-300',
      border: 'border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    },
  }[rarity];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
};
