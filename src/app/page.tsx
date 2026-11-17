'use client';

import React, { useState, useEffect } from 'react';
import {
  StoreItem,
  ProductCategory,
  PWUserProfile,
  StoreOrder,
  SubscriptionTier,
} from '@/types/store';
import {
  INITIAL_ITEMS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_USERS,
  INITIAL_ORDERS,
} from '@/lib/mock-data';
import { DiscordSidebar, ActiveTab } from '@/components/layout/DiscordSidebar';
import { DiscordProfileCard } from '@/components/preview/DiscordProfileCard';
import { ProductModal } from '@/components/products/ProductModal';
import { GrantItemModal } from '@/components/users/GrantItemModal';
import { RarityBadge } from '@/components/common/RarityBadge';
import {
  Plus,
  Search,
  Layers,
  Film,
  Flame,
  Crown,
  Coins,
  Package,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Gift,
  Database,
  ArrowRight,
  Shield,
  Zap,
  Award,
  Store,
  UserCheck,
  X,
} from 'lucide-react';

export default function AdminPWShopPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [items, setItems] = useState<StoreItem[]>(INITIAL_ITEMS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionTier[]>(INITIAL_SUBSCRIPTIONS);
  const [users, setUsers] = useState<PWUserProfile[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<StoreOrder[]>(INITIAL_ORDERS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [productModalDefaultCategory, setProductModalDefaultCategory] = useState<ProductCategory>('avatar_decoration');
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  // Live Preview Target
  const [previewDecoration, setPreviewDecoration] = useState<StoreItem | null>(INITIAL_ITEMS[0]);
  const [previewEffect, setPreviewEffect] = useState<StoreItem | null>(INITIAL_ITEMS[3]);
  const [previewNameplate, setPreviewNameplate] = useState<StoreItem | null>(INITIAL_ITEMS[6]);
  const [previewUser, setPreviewUser] = useState<PWUserProfile>(INITIAL_USERS[0]);

  // Sync Status notification
  const [syncNotice, setSyncNotice] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>({
    msg: 'Painel PW integrado: alterações atualizam o Supabase e notificam o Firebase.',
    type: 'info',
  });

  // Test Ping from API
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);

  useEffect(() => {
    fetch('/api/sync-pw')
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch(() => {});
  }, []);

  const triggerSyncNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setSyncNotice({ msg, type });
    setTimeout(() => {
      setSyncNotice(null);
    }, 4000);
  };

  // Product Actions
  const handleSaveProduct = (itemData: Partial<StoreItem>) => {
    if (itemData.id) {
      // Edit
      setItems((prev) =>
        prev.map((it) => (it.id === itemData.id ? ({ ...it, ...itemData, updatedAt: new Date().toISOString() } as StoreItem) : it))
      );
      triggerSyncNotification(`"${itemData.title}" atualizado com sucesso no catálogo!`);
    } else {
      // Create
      const newItem: StoreItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as StoreItem;
      setItems((prev) => [newItem, ...prev]);
      triggerSyncNotification(`Novo item "${newItem.title}" publicado na loja do PW!`);
    }
  };

  const handleDeleteProduct = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (confirm(`Tem certeza que deseja remover "${item?.title || 'este produto'}" da loja?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      triggerSyncNotification(`Item removido da loja e sincronizado.`);
    }
  };

  const handleToggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i))
    );
    triggerSyncNotification(`Status do item alterado na loja.`);
  };

  const handleGrantItemToUser = (userId: string, itemId: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            inventoryItemIds: [...u.inventoryItemIds, itemId],
            activeDecoration: targetItem?.category === 'avatar_decoration' ? targetItem : u.activeDecoration,
            activeEffect: targetItem?.category === 'profile_effect' ? targetItem : u.activeEffect,
          };
        }
        return u;
      })
    );
    triggerSyncNotification(`Item "${targetItem?.title}" entregue no inventário do usuário!`);
  };

  const handleGrantCoinsToUser = (userId: string, amount: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, coinsBalance: u.coinsBalance + amount } : u))
    );
    triggerSyncNotification(`${amount} PW Coins creditadas na carteira do usuário!`);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsCount = {
    decorations: items.filter((i) => i.category === 'avatar_decoration').length,
    effects: items.filter((i) => i.category === 'profile_effect').length,
    badges: items.filter((i) => i.category === 'badge' || i.category === 'nameplate').length,
    nitro: subscriptions.length,
    coins: items.filter((i) => i.category === 'coin_pack').length,
    bundles: items.filter((i) => i.category === 'bundle').length,
  };

  // Open modal helper
  const openCreateModal = (cat: ProductCategory) => {
    setEditingItem(null);
    setProductModalDefaultCategory(cat);
    setIsProductModalOpen(true);
  };

  const openEditModal = (item: StoreItem) => {
    setEditingItem(item);
    setProductModalDefaultCategory(item.category);
    setIsProductModalOpen(true);
  };

  const testPingFirebaseSupabase = async () => {
    setIsTestingPing(true);
    try {
      const res = await fetch('/api/sync-pw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ITEM_UPDATED',
          targetId: 'ping-test',
          data: { ping: true, time: new Date().toISOString() },
        }),
      });
      const data = await res.json();
      triggerSyncNotification(data.message || 'Ping executado com sucesso!', 'success');
      const getRes = await fetch('/api/sync-pw');
      setApiStatus(await getRes.json());
    } catch (e: any) {
      triggerSyncNotification(`Erro no teste: ${e.message}`, 'error');
    } finally {
      setIsTestingPing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#313338] text-[#dbdee1] font-sans overflow-hidden">
      {/* 1. DISCORD SIDEBAR */}
      <DiscordSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'decorations') setFilterCategory('avatar_decoration');
          else if (tab === 'effects') setFilterCategory('profile_effect');
          else if (tab === 'badges_names') setFilterCategory('badge');
          else if (tab === 'coins') setFilterCategory('coin_pack');
          else if (tab === 'bundles') setFilterCategory('bundle');
          else if (tab === 'catalog') setFilterCategory('all');
        }}
        itemsCount={itemsCount}
      />

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Channel Header */}
        <header className="h-12 border-b border-[#202225] bg-[#313338] px-4 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#80848e] text-lg font-bold">#</span>
            <span className="font-bold text-white text-sm">
              {activeTab === 'catalog' && 'loja-catalogo-geral'}
              {activeTab === 'decorations' && 'molduras-de-avatar'}
              {activeTab === 'effects' && 'efeitos-de-perfil'}
              {activeTab === 'badges_names' && 'insignias-e-nomes'}
              {activeTab === 'nitro' && 'planos-nitro-e-beneficios'}
              {activeTab === 'coins' && 'pacotes-de-moedas-pw'}
              {activeTab === 'bundles' && 'bundles-promocionais'}
              {activeTab === 'users' && 'gerenciador-de-usuarios'}
              {activeTab === 'orders' && 'pedidos-e-metricas'}
              {activeTab === 'settings' && 'conexao-supabase-firebase'}
            </span>
            <div className="w-[1px] h-4 bg-[#4e5058] mx-2" />
            <span className="text-xs text-[#949ba4] hidden md:inline truncate">
              Painel de Administração da Loja Oficial do PW
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cosméticos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1e1f22] text-xs text-[#dbdee1] pl-8 pr-3 py-1.5 rounded-md border border-transparent focus:border-[#5865f2] focus:outline-none w-36 sm:w-56 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#949ba4] absolute left-2.5 top-2.5" />
            </div>

            {/* Create Product Button */}
            <button
              onClick={() => openCreateModal('avatar_decoration')}
              className="flex items-center gap-1.5 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Produto</span>
            </button>
          </div>
        </header>

        {/* Sync Notification Banner */}
        {syncNotice && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between ${
              syncNotice.type === 'error'
                ? 'bg-rose-950/80 border-b border-rose-500/30 text-rose-300'
                : 'bg-[#2b2d31] border-b border-[#383a40] text-[#dbdee1]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#23a55a] animate-ping" />
              <span>{syncNotice.msg}</span>
            </div>
            <button onClick={() => setSyncNotice(null)} className="text-[#949ba4] hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body with 2 Columns: Main View + Live Preview Card */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Tab Content View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* =========================================================================
                TAB 1: CATALOG / DECORATIONS / EFFECTS / BADGES
            ========================================================================== */}
            {(activeTab === 'catalog' ||
              activeTab === 'decorations' ||
              activeTab === 'effects' ||
              activeTab === 'badges_names' ||
              activeTab === 'coins' ||
              activeTab === 'bundles') && (
              <div className="space-y-6">
                {/* DISCORD SHOP HERO BANNER */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#201533] via-[#1f2338] to-[#121c2b] border border-[#383a40] p-6 shadow-xl">
                  <div className="relative z-10 max-w-xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5865f2]/20 border border-[#5865f2]/40 text-[#5865f2] text-xs font-bold uppercase tracking-wider">
                      <Store className="w-3.5 h-3.5" /> Loja Integrada do PW
                    </div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                      Loja de Colecionáveis & Cosméticos
                    </h2>
                    <p className="text-xs text-[#949ba4] leading-relaxed">
                      Gerencie molduras de avatar, efeitos dinâmicos de perfil, insígnias, pacotes de moedas e assinaturas. Os dados são sincronizados no Supabase e distribuídos para os usuários do aplicativo PW via Firebase.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => openCreateModal('avatar_decoration')}
                        className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                      >
                        <Flame className="w-3.5 h-3.5" /> Adicionar Moldura
                      </button>
                      <button
                        onClick={() => openCreateModal('profile_effect')}
                        className="bg-[#2b2d31] hover:bg-[#35373c] border border-[#383a40] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5 text-purple-400" /> Adicionar Efeito de Perfil
                      </button>
                      <button
                        onClick={() => setIsGrantModalOpen(true)}
                        className="bg-[#23a55a] hover:bg-[#1d8246] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" /> Conceder Item a Usuário
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#2b2d31] p-3 rounded-xl border border-[#383a40]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'Todos os Itens' },
                      { id: 'avatar_decoration', label: 'Molduras de Avatar' },
                      { id: 'profile_effect', label: 'Efeitos de Perfil' },
                      { id: 'badge', label: 'Insígnias & Nomes' },
                      { id: 'coin_pack', label: 'Pacotes de Moedas' },
                      { id: 'bundle', label: 'Bundles' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          filterCategory === cat.id
                            ? 'bg-[#5865f2] text-white shadow'
                            : 'bg-[#1e1f22] text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#35373c]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-[#949ba4]">
                    Exibindo <strong className="text-white">{filteredItems.length}</strong> produtos
                  </span>
                </div>

                {/* PRODUCT CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-[#2b2d31] rounded-2xl border border-[#383a40] overflow-hidden hover:border-[#5865f2]/60 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Image / Preview Area */}
                        <div className="relative h-44 bg-[#1e1f22] flex items-center justify-center overflow-hidden border-b border-[#313338]">
                          {item.category === 'avatar_decoration' && (
                            <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
                              <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                                alt="Demo Avatar"
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div
                                className={`absolute -inset-1 rounded-full border-4 border-dashed animate-glow pointer-events-none`}
                                style={{
                                  borderColor: item.config?.gradientColors?.[0] || '#5865F2',
                                  boxShadow: `0 0 15px ${item.config?.gradientColors?.[0] || '#5865F2'}`,
                                }}
                              />
                            </div>
                          )}

                          {item.category === 'profile_effect' && (
                            <div className="w-full h-full relative">
                              <img
                                src={item.previewUrl}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2d31] via-transparent to-transparent" />
                              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] text-purple-300">
                                <Film className="w-3 h-3 text-purple-400" />
                                <span>Efeito Animado</span>
                              </div>
                            </div>
                          )}

                          {item.category !== 'avatar_decoration' && item.category !== 'profile_effect' && (
                            <img
                              src={item.previewUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <RarityBadge rarity={item.rarity} />
                            {item.isLimited && (
                              <span className="bg-rose-950/80 border border-rose-500/50 text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                LIMITADO
                              </span>
                            )}
                          </div>

                          {/* Quick Live Preview Button */}
                          <button
                            onClick={() => {
                              if (item.category === 'avatar_decoration') setPreviewDecoration(item);
                              if (item.category === 'profile_effect') setPreviewEffect(item);
                              if (item.category === 'nameplate') setPreviewNameplate(item);
                              triggerSyncNotification(`Testando "${item.title}" no Card de Perfil ao lado!`, 'info');
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-[#5865f2] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Testar no card ao vivo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Card Info */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-[#f2f3f5] leading-tight group-hover:text-[#5865f2] transition-colors">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-xs text-[#949ba4] line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Prices & Actions */}
                      <div className="p-4 pt-0">
                        <div className="pt-3 border-t border-[#383a40] flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-extrabold text-white flex items-center gap-1">
                              <span>R$ {item.priceBRL.toFixed(2)}</span>
                            </div>
                            <div className="text-[11px] font-semibold text-[#f0b232] flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-[#f0b232]" />
                              <span>{item.priceCoins.toLocaleString('pt-BR')} Coins</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleActive(item.id)}
                              className={`p-1.5 rounded-lg text-xs font-semibold ${
                                item.isActive
                                  ? 'bg-[#23a55a]/20 text-[#23a55a] hover:bg-[#23a55a]/30'
                                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                              }`}
                              title={item.isActive ? 'Ativo na Loja (Clique para desativar)' : 'Desativado (Clique para ativar)'}
                            >
                              {item.isActive ? 'Ativo' : 'Pausado'}
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 rounded-lg bg-[#35373c] hover:bg-[#404249] text-[#dbdee1] transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id)}
                              className="p-1.5 rounded-lg bg-[#35373c] hover:bg-rose-900/60 text-[#dbdee1] hover:text-rose-300 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 2: NITRO & SUBSCRIPTIONS
            ========================================================================== */}
            {activeTab === 'nitro' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#2c1338] via-[#3a1b47] to-[#1e1430] p-6 rounded-2xl border border-[#ff73fa]/30 shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#ff73fa] text-xs font-bold uppercase tracking-wider">
                    <Crown className="w-4 h-4" /> Sistema de Assinaturas Estilo Discord Nitro
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Planos & Benefícios PW Nitro</h2>
                  <p className="text-xs text-[#949ba4] max-w-xl">
                    Configure os tiers de assinatura, benefícios exclusivos, limites de upload, descontos na loja de cosméticos e bônus mensal de PW Coins.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-[#2b2d31] rounded-2xl border border-[#383a40] p-6 flex flex-col justify-between hover:border-[#ff73fa]/50 transition-all shadow-lg"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-[#1e1f22]">
                            {sub.id === 'nitro_basic' && <Zap className="w-6 h-6 text-[#5865F2]" />}
                            {sub.id === 'nitro_booster' && <Award className="w-6 h-6 text-[#F47FFF]" />}
                            {sub.id === 'nitro_ultimate' && <Crown className="w-6 h-6 text-[#F0B232]" />}
                          </div>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"
                            style={{ backgroundColor: `${sub.color}22`, color: sub.color }}
                          >
                            {sub.badgeName}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-extrabold text-white">{sub.name}</h3>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-white">
                              R$ {sub.monthlyPriceBRL.toFixed(2)}
                            </span>
                            <span className="text-xs text-[#949ba4]">/ mês</span>
                          </div>
                          <div className="text-xs text-[#23a55a] font-medium mt-0.5">
                            ou R$ {sub.yearlyPriceBRL.toFixed(2)} / ano (com desconto)
                          </div>
                        </div>

                        <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#313338] text-xs space-y-1">
                          <div className="text-[#f0b232] font-bold flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5" />
                            <span>+{sub.monthlyCoinsBonus} PW Coins mensais</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase text-[#949ba4] tracking-wider block">
                            Benefícios Inclusos:
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#dbdee1]">
                            {sub.perks.map((perk, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#23a55a] shrink-0 mt-0.5" />
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => {
                            const newPrice = prompt(`Novo valor mensal em R$ para ${sub.name}:`, sub.monthlyPriceBRL.toString());
                            if (newPrice) {
                              setSubscriptions((prev) =>
                                prev.map((s) => (s.id === sub.id ? { ...s, monthlyPriceBRL: parseFloat(newPrice) || s.monthlyPriceBRL } : s))
                              );
                              triggerSyncNotification(`Preço do plano ${sub.name} atualizado!`);
                            }
                          }}
                          className="w-full py-2 rounded-xl bg-[#35373c] hover:bg-[#5865f2] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" /> Editar Preço & Vantagens
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 3: USERS & INVENTORY MANAGEMENT
            ========================================================================== */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#2b2d31] p-4 rounded-2xl border border-[#383a40]">
                  <div>
                    <h2 className="text-lg font-bold text-white">Usuários & Inventários do PW</h2>
                    <p className="text-xs text-[#949ba4]">
                      Consulte qualquer usuário cadastrado no Firebase/Supabase, veja itens desbloqueados e conceda cosméticos.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsGrantModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#23a55a] hover:bg-[#1d8246] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow"
                  >
                    <Gift className="w-4 h-4" />
                    Conceder Cosméticos ou Coins
                  </button>
                </div>

                <div className="bg-[#2b2d31] rounded-2xl border border-[#383a40] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1e1f22] text-[#949ba4] uppercase font-bold tracking-wider text-[10px] border-b border-[#383a40]">
                      <tr>
                        <th className="px-4 py-3">Usuário</th>
                        <th className="px-4 py-3">Plano Nitro</th>
                        <th className="px-4 py-3">Saldo de Coins</th>
                        <th className="px-4 py-3">Cosméticos Ativos</th>
                        <th className="px-4 py-3">Itens no Inventário</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#383a40]/60">
                      {users.map((usr) => (
                        <tr key={usr.id} className="hover:bg-[#35373c]/40 transition-colors">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img
                              src={usr.avatarUrl}
                              alt={usr.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">
                                {usr.username}#{usr.discriminator}
                              </div>
                              <div className="text-[10px] text-[#949ba4]">ID: {usr.id}</div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            {usr.subscriptionTier && usr.subscriptionTier !== 'none' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff73fa]/20 to-[#8045ff]/20 text-[#ff73fa] font-bold text-[11px] border border-[#ff73fa]/30">
                                <Zap className="w-3 h-3" /> {usr.subscriptionTier.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-zinc-500">Nenhum</span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-bold text-[#f0b232] flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {usr.coinsBalance.toLocaleString('pt-BR')}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="space-y-0.5">
                              {usr.activeDecoration && (
                                <div className="text-[11px] text-[#5865f2] flex items-center gap-1">
                                  <UserCheck className="w-3 h-3 text-[#5865f2]" />
                                  <span>{usr.activeDecoration.title}</span>
                                </div>
                              )}
                              {usr.activeEffect && (
                                <div className="text-[11px] text-purple-400 flex items-center gap-1">
                                  <Layers className="w-3 h-3 text-purple-400" />
                                  <span>{usr.activeEffect.title}</span>
                                </div>
                              )}
                              {!usr.activeDecoration && !usr.activeEffect && (
                                <span className="text-zinc-500">Padrão</span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="bg-[#1e1f22] px-2 py-1 rounded-md text-[11px] font-semibold text-[#dbdee1]">
                              {usr.inventoryItemIds.length} cosméticos
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setPreviewUser(usr);
                                  setPreviewDecoration(usr.activeDecoration || null);
                                  setPreviewEffect(usr.activeEffect || null);
                                  setPreviewNameplate(usr.activeNameplate || null);
                                  triggerSyncNotification(`Inspecionando perfil de @${usr.username}`, 'info');
                                }}
                                className="p-1.5 rounded-lg bg-[#1e1f22] hover:bg-[#5865f2] text-white transition-colors"
                                title="Inspecionar no Card de Perfil"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setIsGrantModalOpen(true)}
                                className="p-1.5 rounded-lg bg-[#23a55a]/20 hover:bg-[#23a55a] text-[#23a55a] hover:text-white transition-colors"
                                title="Conceder item ou coins"
                              >
                                <Gift className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 4: ORDERS & SALES ANALYTICS
            ========================================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#2b2d31] p-5 rounded-2xl border border-[#383a40] space-y-1">
                    <span className="text-xs font-bold uppercase text-[#949ba4]">Faturamento Bruto</span>
                    <div className="text-2xl font-extrabold text-white">R$ 1.284,50</div>
                    <div className="text-[11px] text-[#23a55a] flex items-center gap-1">
                      <span>+18.4% esta semana</span>
                    </div>
                  </div>

                  <div className="bg-[#2b2d31] p-5 rounded-2xl border border-[#383a40] space-y-1">
                    <span className="text-xs font-bold uppercase text-[#949ba4]">Moedas (Coins) Gastas</span>
                    <div className="text-2xl font-extrabold text-[#f0b232] flex items-center gap-1.5">
                      <Coins className="w-6 h-6" />
                      <span>48.200</span>
                    </div>
                    <div className="text-[11px] text-[#949ba4]">Em cosméticos na loja</div>
                  </div>

                  <div className="bg-[#2b2d31] p-5 rounded-2xl border border-[#383a40] space-y-1">
                    <span className="text-xs font-bold uppercase text-[#949ba4]">Assinaturas Ativas</span>
                    <div className="text-2xl font-extrabold text-[#ff73fa]">142 Usuários</div>
                    <div className="text-[11px] text-[#ff73fa]">PW Nitro Booster</div>
                  </div>
                </div>

                <div className="bg-[#2b2d31] rounded-2xl border border-[#383a40] overflow-hidden">
                  <div className="p-4 border-b border-[#383a40] flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Últimas Transações da Loja</h3>
                    <span className="text-xs text-[#949ba4]">Sincronizado com Supabase `store_orders`</span>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1e1f22] text-[#949ba4] uppercase font-bold tracking-wider text-[10px] border-b border-[#383a40]">
                      <tr>
                        <th className="px-4 py-3">ID Pedido</th>
                        <th className="px-4 py-3">Comprador</th>
                        <th className="px-4 py-3">Item Adquirido</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Método</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#383a40]/60">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#35373c]/30">
                          <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">{ord.id}</td>
                          <td className="px-4 py-3 font-bold text-white">{ord.username}</td>
                          <td className="px-4 py-3 font-medium text-[#dbdee1]">{ord.itemTitle}</td>
                          <td className="px-4 py-3 font-bold">
                            {ord.amountBRL > 0 ? (
                              <span className="text-white">R$ {ord.amountBRL.toFixed(2)}</span>
                            ) : (
                              <span className="text-[#f0b232] flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5" />
                                {ord.amountCoins} Coins
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 uppercase text-[10px] font-semibold text-[#949ba4]">
                            {ord.paymentMethod}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#23a55a]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400">
                            {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 5: SETTINGS & SUPABASE / FIREBASE INTEGRATION
            ========================================================================== */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-[#2b2d31] p-6 rounded-2xl border border-[#383a40] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                        <Database className="w-6 h-6" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-white">Conexão: Supabase & Firebase</h2>
                        <p className="text-xs text-[#949ba4]">
                          O banco de dados é hospedado no Supabase e o servidor backend do PW está no Firebase.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={testPingFirebaseSupabase}
                      disabled={isTestingPing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold shadow disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                      <span>Testar Conexão em Tempo Real</span>
                    </button>
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#1e1f22] border border-[#383a40] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Supabase Database (PostgreSQL)
                        </span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                          Ativo
                        </span>
                      </div>
                      <p className="text-xs text-[#949ba4]">
                        Tabelas: <code>store_items</code>, <code>user_profiles</code>, <code>user_inventory</code>, <code>subscription_plans</code>.
                      </p>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        URL: {apiStatus?.services?.supabase?.url || 'https://...supabase.co'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#1e1f22] border border-[#383a40] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          Firebase PW Backend Webhook
                        </span>
                        <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                          Pronto
                        </span>
                      </div>
                      <p className="text-xs text-[#949ba4]">
                        Dispara requisições autenticadas para o servidor do PW no Firebase quando um produto é publicado ou concedido.
                      </p>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        Webhook: {apiStatus?.services?.firebase?.webhookUrl || 'Firebase Functions / Realtime API'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SQL Schema Instructions */}
                <div className="bg-[#2b2d31] p-6 rounded-2xl border border-[#383a40] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Script SQL de Inicialização (Supabase)</h3>
                      <p className="text-xs text-[#949ba4]">
                        Criamos o arquivo <code className="text-[#5865f2]">supabase/schema.sql</code> e <code className="text-[#5865f2]">supabase/seed.sql</code> pronto para colar no SQL Editor do seu Supabase.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('supabase/schema.sql');
                        triggerSyncNotification('Caminho do arquivo copiado!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1f22] hover:bg-[#35373c] text-xs text-[#dbdee1]"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Caminho
                    </button>
                  </div>

                  <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40] font-mono text-xs text-zinc-300 space-y-1">
                    <div className="text-[#5865f2] font-bold">-- Passos para rodar no Supabase:</div>
                    <div>1. Abra o painel do seu projeto no Supabase (https://supabase.com/dashboard).</div>
                    <div>2. Vá até a aba "SQL Editor" na barra lateral esquerda.</div>
                    <div>3. Cole o conteúdo de <span className="text-white font-bold">supabase/schema.sql</span> e clique em "Run".</div>
                    <div>4. (Opcional) Cole o conteúdo de <span className="text-white font-bold">supabase/seed.sql</span> para já ter todos os cosméticos carregados.</div>
                  </div>
                </div>

                {/* Env Vars Configuration Guide */}
                <div className="bg-[#2b2d31] p-6 rounded-2xl border border-[#383a40] space-y-4">
                  <h3 className="text-sm font-bold text-white">Variáveis de Ambiente (.env.local)</h3>
                  <p className="text-xs text-[#949ba4]">
                    Adicione estas variáveis no arquivo <code>.env.local</code> do projeto:
                  </p>

                  <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40] font-mono text-xs text-emerald-400 space-y-1 select-all">
                    <div>NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui</div>
                    <div>SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-secreta</div>
                    <div>FIREBASE_PW_WEBHOOK_URL=https://us-central1-seu-projeto.cloudfunctions.net/onShopSync</div>
                    <div>PW_SYNC_SECRET=pw_super_secret_token_2026</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE DISCORD PROFILE PREVIEW BAR (Sticky & Realtime) */}
          <div className="w-[380px] bg-[#2b2d31] border-l border-[#202225] p-5 hidden xl:flex flex-col items-center justify-between shrink-0 overflow-y-auto">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#949ba4] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#5865f2]" />
                  Preview ao Vivo do Perfil
                </span>
                <span className="text-[10px] bg-[#1e1f22] text-[#23a55a] px-2 py-0.5 rounded-full font-bold">
                  PW Client 2026
                </span>
              </div>

              {/* Pixel-Perfect Discord Profile Card */}
              <div className="flex justify-center pt-2">
                <DiscordProfileCard
                  user={previewUser}
                  previewDecoration={previewDecoration}
                  previewEffect={previewEffect}
                  previewNameplate={previewNameplate}
                />
              </div>

              {/* Preview Controls Bar */}
              <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#383a40] space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase text-[#949ba4] tracking-wider block">
                  Cosméticos em Demonstração:
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#949ba4]">Moldura:</span>
                    <span className="text-[#5865f2] font-semibold truncate max-w-[180px]">
                      {previewDecoration?.title || 'Nenhuma'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#949ba4]">Efeito:</span>
                    <span className="text-purple-400 font-semibold truncate max-w-[180px]">
                      {previewEffect?.title || 'Nenhum'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#949ba4]">Nameplate:</span>
                    <span className="text-amber-400 font-semibold truncate max-w-[180px]">
                      {previewNameplate?.title || 'Padrão'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#313338] flex gap-2">
                  <button
                    onClick={() => {
                      setPreviewDecoration(null);
                      setPreviewEffect(null);
                      setPreviewNameplate(null);
                    }}
                    className="w-full py-1 text-[10px] font-semibold text-[#949ba4] hover:text-white rounded bg-[#2b2d31] hover:bg-[#35373c]"
                  >
                    Limpar Cosméticos
                  </button>
                  <button
                    onClick={() => {
                      setPreviewDecoration(items.find((i) => i.category === 'avatar_decoration') || null);
                      setPreviewEffect(items.find((i) => i.category === 'profile_effect') || null);
                      setPreviewNameplate(items.find((i) => i.category === 'nameplate') || null);
                    }}
                    className="w-full py-1 text-[10px] font-semibold text-[#5865f2] hover:text-white rounded bg-[#5865f2]/10 hover:bg-[#5865f2]"
                  >
                    Restaurar Padrão
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Info note */}
            <div className="text-[11px] text-[#949ba4] text-center pt-4">
              Qualquer cosmético criado no painel pode ser testado instantaneamente aqui antes de ser publicado.
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialItem={editingItem}
        defaultCategory={productModalDefaultCategory}
        onLivePreview={(item) => {
          if (item.category === 'avatar_decoration') setPreviewDecoration(item as StoreItem);
          if (item.category === 'profile_effect') setPreviewEffect(item as StoreItem);
          if (item.category === 'nameplate') setPreviewNameplate(item as StoreItem);
          triggerSyncNotification('Cosmético aplicado no Preview do Perfil ao lado!', 'info');
        }}
      />

      <GrantItemModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        users={users}
        items={items}
        onGrantItem={handleGrantItemToUser}
        onGrantCoins={handleGrantCoinsToUser}
      />
    </div>
  );
}
