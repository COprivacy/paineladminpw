'use client';

import React, { useState, useEffect } from 'react';
import { StoreItem, ProductCategory, ProductRarity } from '@/types/store';
import { X, Save, SlidersHorizontal, Eye, Coins } from 'lucide-react';
import { RarityBadge } from '../common/RarityBadge';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<StoreItem>) => void;
  initialItem?: StoreItem | null;
  defaultCategory?: ProductCategory;
  onLivePreview?: (item: Partial<StoreItem>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory = 'avatar_decoration',
  onLivePreview,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>(defaultCategory);
  const [rarity, setRarity] = useState<ProductRarity>('rare');
  const [priceBRL, setPriceBRL] = useState<number>(19.9);
  const [priceCoins, setPriceCoins] = useState<number>(500);
  const [assetUrl, setAssetUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLimited, setIsLimited] = useState(false);
  const [availableUntil, setAvailableUntil] = useState('');
  const [featured, setFeatured] = useState(false);

  // Specific configs
  const [animationType, setAnimationType] = useState<'glow' | 'flame' | 'wave' | 'pulse' | 'matrix'>('glow');
  const [gradientColor1, setGradientColor1] = useState('#5865F2');
  const [gradientColor2, setGradientColor2] = useState('#F47FFF');
  const [coinsAmount, setCoinsAmount] = useState(1000);
  const [coinsBonusPercent, setCoinsBonusPercent] = useState(20);
  const [perksText, setPerksText] = useState('Benefício 1\nBenefício 2');

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || '');
      setDescription(initialItem.description || '');
      setCategory(initialItem.category || defaultCategory);
      setRarity(initialItem.rarity || 'rare');
      setPriceBRL(initialItem.priceBRL || 0);
      setPriceCoins(initialItem.priceCoins || 0);
      setAssetUrl(initialItem.assetUrl || '');
      setPreviewUrl(initialItem.previewUrl || '');
      setIsLimited(initialItem.isLimited || false);
      setAvailableUntil(initialItem.availableUntil || '');
      setFeatured(initialItem.featured || false);
      if (initialItem.config?.animationType) {
        setAnimationType(initialItem.config.animationType as any);
      }
      if (initialItem.config?.gradientColors) {
        setGradientColor1(initialItem.config.gradientColors[0] || '#5865F2');
        setGradientColor2(initialItem.config.gradientColors[1] || '#F47FFF');
      }
      if (initialItem.config?.coinsAmount) setCoinsAmount(initialItem.config.coinsAmount);
      if (initialItem.config?.coinsBonusPercent) setCoinsBonusPercent(initialItem.config.coinsBonusPercent);
      if (initialItem.config?.perksList) setPerksText(initialItem.config.perksList.join('\n'));
    } else {
      setTitle('');
      setDescription('');
      setCategory(defaultCategory);
      setRarity('rare');
      setPriceBRL(19.9);
      setPriceCoins(500);
      setAssetUrl('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400');
      setPreviewUrl('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400');
      setIsLimited(false);
      setFeatured(false);
      setGradientColor1('#5865F2');
      setGradientColor2('#F47FFF');
    }
  }, [initialItem, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreview = () => {
    const currentItem: Partial<StoreItem> = {
      title: title || 'Item em Criação',
      description,
      category,
      rarity,
      priceBRL,
      priceCoins,
      assetUrl,
      previewUrl,
      config: {
        animationType,
        gradientColors: [gradientColor1, gradientColor2],
        accentColor: gradientColor1,
        bannerColor: '#12141a',
        coinsAmount,
        coinsBonusPercent,
        perksList: perksText.split('\n').filter(Boolean),
      },
    };
    onLivePreview?.(currentItem);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData: Partial<StoreItem> = {
      ...(initialItem ? { id: initialItem.id } : {}),
      title,
      description,
      category,
      rarity,
      priceBRL: Number(priceBRL),
      priceCoins: Number(priceCoins),
      assetUrl: assetUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
      previewUrl: previewUrl || assetUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
      isLimited,
      availableUntil: isLimited ? availableUntil : null,
      featured,
      isActive: true,
      config: {
        animationType,
        gradientColors: [gradientColor1, gradientColor2],
        accentColor: gradientColor1,
        bannerColor: '#12141a',
        coinsAmount: Number(coinsAmount),
        coinsBonusPercent: Number(coinsBonusPercent),
        perksList: perksText.split('\n').filter(Boolean),
      },
    };
    onSave(itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#2b2d31] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#383a40] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#232428] border-b border-[#1f2023] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#5865f2]/20 text-[#5865f2]">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#f2f3f5]">
                {initialItem ? 'Editar Produto da Loja' : 'Criar Novo Produto para a Loja PW'}
              </h2>
              <p className="text-xs text-[#949ba4]">
                Os cosméticos ficam disponíveis instantaneamente para o cliente do PW via Supabase & Firebase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#949ba4] hover:text-white p-1 rounded-lg hover:bg-[#35373c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Categoria & Raridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                Categoria do Produto
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
              >
                <option value="avatar_decoration">Moldura de Avatar (Avatar Decoration)</option>
                <option value="profile_effect">Efeito de Perfil (Profile Effect)</option>
                <option value="badge">Insígnia de Perfil (Badge)</option>
                <option value="nameplate">Estilo de Nome (Nameplate)</option>
                <option value="profile_theme">Tema de Perfil (Banner e Cores)</option>
                <option value="coin_pack">Pacote de Moedas PW</option>
                <option value="bundle">Pacote Promocional (Bundle)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                Nível de Raridade
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as ProductRarity)}
                  className="flex-1 bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
                >
                  <option value="common">Comum</option>
                  <option value="rare">Raro</option>
                  <option value="epic">Épico</option>
                  <option value="legendary">Lendário</option>
                  <option value="mythic">Mítico</option>
                </select>
                <RarityBadge rarity={rarity} />
              </div>
            </div>
          </div>

          {/* Título & Descrição */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
              Nome do Produto
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Katana Cibernética Neon"
              className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
              Descrição para a Loja
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Espadas cruzadas brilhantes que pulsam ao redor do seu avatar..."
              className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          {/* Preços: R$ e PW Coins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1e1f22] p-4 rounded-xl border border-[#313338]">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                Preço em Dinheiro Real (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-[#949ba4]">R$</span>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={priceBRL}
                  onChange={(e) => setPriceBRL(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#2b2d31] border border-[#383a40] rounded-lg pl-10 pr-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-[#5865f2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                Preço em Moedas do PW (Coins)
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-[#f0b232] absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={priceCoins}
                  onChange={(e) => setPriceCoins(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#2b2d31] border border-[#383a40] rounded-lg pl-10 pr-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-[#5865f2]"
                />
              </div>
            </div>
          </div>

          {/* URLs de Assets & Preview */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                URL do Arquivo Principal (Asset / Supabase Storage)
              </label>
              <input
                type="text"
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                placeholder="https://.../asset.webp ou apng ou mp4"
                className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
              />
              <span className="text-[11px] text-[#949ba4]">
                Dica: Você pode hospedar no bucket <code className="text-[#5865f2]">pw-shop-assets</code> do Supabase Storage.
              </span>
            </div>

            {/* Configurações Específicas por Categoria */}
            {(category === 'avatar_decoration' || category === 'profile_effect' || category === 'nameplate') && (
              <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5865f2]">
                  Configurações Visuais & Efeitos
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#949ba4] mb-1">Tipo de Animação</label>
                    <select
                      value={animationType}
                      onChange={(e) => setAnimationType(e.target.value as any)}
                      className="w-full bg-[#2b2d31] border border-[#383a40] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="glow">Brilho Neon (Glow)</option>
                      <option value="flame">Chamas Ardentes (Flame)</option>
                      <option value="wave">Efeito Ondulante (Wave)</option>
                      <option value="pulse">Pulso Elétrico (Lightning)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#949ba4] mb-1">Cor Primária / Glow</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientColor1}
                        onChange={(e) => setGradientColor1(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={gradientColor1}
                        onChange={(e) => setGradientColor1(e.target.value)}
                        className="flex-1 bg-[#2b2d31] border border-[#383a40] rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#949ba4] mb-1">Cor Secundária</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        className="flex-1 bg-[#2b2d31] border border-[#383a40] rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Configurações para Pacotes de Moedas */}
            {category === 'coin_pack' && (
              <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40] grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#949ba4] mb-1">Quantidade de Moedas</label>
                  <input
                    type="number"
                    value={coinsAmount}
                    onChange={(e) => setCoinsAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#2b2d31] border border-[#383a40] rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#949ba4] mb-1">% de Bônus Exibido</label>
                  <input
                    type="number"
                    value={coinsBonusPercent}
                    onChange={(e) => setCoinsBonusPercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#2b2d31] border border-[#383a40] rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
              </div>
            )}

            {/* Configurações para Bundles */}
            {category === 'bundle' && (
              <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40]">
                <label className="block text-[11px] text-[#949ba4] mb-1">
                  Benefícios / Itens Inclusos (Um por linha)
                </label>
                <textarea
                  rows={3}
                  value={perksText}
                  onChange={(e) => setPerksText(e.target.value)}
                  placeholder="Moldura Katana Neon&#10;Efeito Raios Elétricos&#10;Nameplate Neon"
                  className="w-full bg-[#2b2d31] border border-[#383a40] rounded px-3 py-1.5 text-xs text-white"
                />
              </div>
            )}
          </div>

          {/* Opções: Limitado & Destaque */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#383a40]/60">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#dbdee1]">
              <input
                type="checkbox"
                checked={isLimited}
                onChange={(e) => setIsLimited(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1e1f22] border-[#383a40] text-[#5865f2] focus:ring-0"
              />
              <span>Edição Limitada (Tempo limitado)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#dbdee1]">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1e1f22] border-[#383a40] text-[#5865f2] focus:ring-0"
              />
              <span>Destaque na Loja (Banner Carrossel)</span>
            </label>
          </div>
        </form>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#232428] border-t border-[#1f2023] flex items-center justify-between">
          <button
            type="button"
            onClick={handleApplyPreview}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#35373c] hover:bg-[#404249] text-[#dbdee1] text-xs font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-[#5865f2]" />
            Testar no Card de Perfil
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-[#dbdee1] hover:underline"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] text-white font-semibold text-sm shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              Salvar & Sincronizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
