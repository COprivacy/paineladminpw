'use client';

import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Crown,
  Coins,
  Package,
  Users,
  BarChart3,
  Flame,
  Tag,
  Database,
  Mic,
  Headphones,
  Settings,
  ChevronDown,
  Hash,
  Compass,
  Plus,
} from 'lucide-react';

export type ActiveTab =
  | 'catalog'
  | 'decorations'
  | 'effects'
  | 'badges_names'
  | 'nitro'
  | 'coins'
  | 'bundles'
  | 'users'
  | 'orders'
  | 'settings';

interface DiscordSidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  itemsCount: {
    decorations: number;
    effects: number;
    badges: number;
    nitro: number;
    coins: number;
    bundles: number;
  };
}

export const DiscordSidebar: React.FC<DiscordSidebarProps> = ({
  activeTab,
  onSelectTab,
  itemsCount,
}) => {
  return (
    <div className="flex h-screen select-none">
      {/* 1. FAR LEFT DISCORD SERVER RAIL (#1e1f22) */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 border-r border-[#111214]">
        {/* Discord PW Main Icon */}
        <button
          onClick={() => onSelectTab('catalog')}
          className="relative group w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#5865f2] flex items-center justify-center text-white transition-all duration-200 hover:shadow-lg shadow-indigo-900/40"
          title="PW Admin Shop"
        >
          <span className="font-extrabold text-lg tracking-wider">PW</span>
          <div className="absolute left-0 w-1 h-10 bg-white rounded-r -translate-x-full group-hover:translate-x-0 transition-all duration-200" />
        </button>

        {/* Divider */}
        <div className="w-8 h-[2px] bg-[#35363c] rounded" />

        {/* Loja Icon */}
        <button
          onClick={() => onSelectTab('catalog')}
          className={`relative group w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 ${
            activeTab === 'catalog'
              ? 'bg-[#23a55a] text-white rounded-[16px]'
              : 'bg-[#313338] text-[#dbdee1] hover:bg-[#23a55a] hover:text-white'
          }`}
          title="Catálogo da Loja"
        >
          <ShoppingBag className="w-5 h-5" />
          {activeTab === 'catalog' && (
            <div className="absolute left-0 w-1 h-10 bg-white rounded-r" />
          )}
        </button>

        {/* Assinaturas Nitro Icon */}
        <button
          onClick={() => onSelectTab('nitro')}
          className={`relative group w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 ${
            activeTab === 'nitro'
              ? 'bg-[#f47fff] text-white rounded-[16px]'
              : 'bg-[#313338] text-[#dbdee1] hover:bg-[#f47fff] hover:text-white'
          }`}
          title="PW Nitro & Tiers"
        >
          <Crown className="w-5 h-5" />
        </button>

        {/* Usuários Icon */}
        <button
          onClick={() => onSelectTab('users')}
          className={`relative group w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 ${
            activeTab === 'users'
              ? 'bg-[#5865f2] text-white rounded-[16px]'
              : 'bg-[#313338] text-[#dbdee1] hover:bg-[#5865f2] hover:text-white'
          }`}
          title="Gestão de Usuários"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Conexões DB Icon */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`relative group w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-[#f0b232] text-white rounded-[16px]'
              : 'bg-[#313338] text-[#dbdee1] hover:bg-[#f0b232] hover:text-white'
          }`}
          title="Supabase & Firebase"
        >
          <Database className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* Adicionar / Explorar */}
        <div className="w-12 h-12 rounded-[24px] bg-[#313338] text-[#23a55a] flex items-center justify-center hover:bg-[#23a55a] hover:text-white hover:rounded-[16px] transition-all cursor-pointer">
          <Plus className="w-6 h-6" />
        </div>
        <div className="w-12 h-12 rounded-[24px] bg-[#313338] text-[#949ba4] flex items-center justify-center hover:bg-[#5865f2] hover:text-white hover:rounded-[16px] transition-all cursor-pointer">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      {/* 2. CHANNELS SUB-SIDEBAR (#2b2d31) */}
      <div className="w-60 bg-[#2b2d31] flex flex-col justify-between border-r border-[#1f2023]">
        {/* Server Top Header */}
        <div>
          <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between shadow-sm hover:bg-[#35373c] transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#23a55a] animate-pulse" />
              <h1 className="font-bold text-sm text-[#f2f3f5] truncate">PW Loja & Admin</h1>
            </div>
            <ChevronDown className="w-4 h-4 text-[#949ba4]" />
          </div>

          {/* Navigation Channels List */}
          <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-110px)]">
            {/* Category: COSMÉTICOS DO PERFIL */}
            <div>
              <div className="px-2 mb-1 flex items-center justify-between text-[11px] font-bold text-[#949ba4] tracking-wider uppercase">
                <span>Catálogo & Cosméticos</span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => onSelectTab('catalog')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'catalog'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#80848e]" />
                    <span>loja-geral</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.decorations + itemsCount.effects + itemsCount.badges}
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('decorations')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'decorations'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>molduras-avatar</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.decorations}
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('effects')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'effects'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>efeitos-de-perfil</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.effects}
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('badges_names')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'badges_names'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-rose-400" />
                    <span>insígnias-e-nomes</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.badges}
                  </span>
                </button>
              </div>
            </div>

            {/* Category: MONETIZAÇÃO */}
            <div>
              <div className="px-2 mb-1 flex items-center justify-between text-[11px] font-bold text-[#949ba4] tracking-wider uppercase">
                <span>Monetização & Vendas</span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => onSelectTab('nitro')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'nitro'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[#f47fff]" />
                    <span>planos-nitro</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.nitro}
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('coins')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'coins'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#f0b232]" />
                    <span>pacotes-moedas</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.coins}
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('bundles')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'bundles'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>bundles-promos</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1f22] px-1.5 py-0.5 rounded text-[#949ba4]">
                    {itemsCount.bundles}
                  </span>
                </button>
              </div>
            </div>

            {/* Category: GESTÃO E CONEXÃO */}
            <div>
              <div className="px-2 mb-1 flex items-center justify-between text-[11px] font-bold text-[#949ba4] tracking-wider uppercase">
                <span>Administração & Infra</span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => onSelectTab('users')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'users'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#5865f2]" />
                    <span>usuarios-inventario</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectTab('orders')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span>vendas-e-pedidos</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectTab('settings')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-[#35373c] text-[#f2f3f5] font-medium'
                      : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>supabase-firebase</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM USER BAR (#232428) */}
        <div className="h-14 bg-[#232428] px-2 flex items-center justify-between border-t border-[#1f2023]">
          <div className="flex items-center gap-2 p-1 rounded hover:bg-[#35373c] cursor-pointer flex-1 mr-1">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-bold text-xs">
                PW
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#232428]" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#f2f3f5] truncate">Admin PW</div>
              <div className="text-[10px] text-[#949ba4] truncate">Online • Painel</div>
            </div>
          </div>

          <div className="flex items-center text-[#b5bac1]">
            <button className="p-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1]">
              <Mic className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1]">
              <Headphones className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className="p-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1]"
              title="Configurações de Conexão"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
