'use client';

import React, { useState } from 'react';
import { StoreItem, ProductCategory, ProductRarity, AnimationType } from '@/types/store';
import { X, Save, SlidersHorizontal, Eye, Coins, Calendar, Image as ImageIcon } from 'lucide-react';
import { RarityBadge } from '../common/RarityBadge';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<StoreItem>) => Promise<void> | void;
  initialItem?: StoreItem | null;
  defaultCategory?: ProductCategory;
  onLivePreview?: (item: Partial<StoreItem>) => void;
}

function formatDatetimeLocal(isoString?: string | null): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory = 'avatar_decoration',
  onLivePreview,
}) => {
  const [title, setTitle] = useState(initialItem?.title || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [category, setCategory] = useState<ProductCategory>(initialItem?.category || defaultCategory);
  const [rarity, setRarity] = useState<ProductRarity>(initialItem?.rarity || 'rare');
  const [priceBRL, setPriceBRL] = useState<number>(initialItem?.priceBRL ?? 19.9);
  const [priceCoins, setPriceCoins] = useState<number>(initialItem?.priceCoins ?? 500);
  const [assetUrl, setAssetUrl] = useState(
    initialItem?.assetUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400'
  );
  const [previewUrl, setPreviewUrl] = useState(
    initialItem?.previewUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400'
  );
  const [isLimited, setIsLimited] = useState(initialItem?.isLimited || false);
  const [availableUntil, setAvailableUntil] = useState(() =>
    formatDatetimeLocal(initialItem?.availableUntil)
  );
  const [featured, setFeatured] = useState(initialItem?.featured || false);

  // Specific configs
  const [animationType, setAnimationType] = useState<AnimationType>(
    initialItem?.config?.animationType || 'glow'
  );
  const [gradientColor1, setGradientColor1] = useState(
    initialItem?.config?.gradientColors?.[0] || initialItem?.config?.accentColor || '#5865F2'
  );
  const [gradientColor2, setGradientColor2] = useState(
    initialItem?.config?.gradientColors?.[1] || '#F47FFF'
  );
  const [bannerColor, setBannerColor] = useState(initialItem?.config?.bannerColor || '#12141a');
  const [coinsAmount, setCoinsAmount] = useState(initialItem?.config?.coinsAmount ?? 1000);
  const [coinsBonusPercent, setCoinsBonusPercent] = useState(
    initialItem?.config?.coinsBonusPercent ?? 20
  );
  const [perksText, setPerksText] = useState(
    initialItem?.config?.perksList?.join('\n') || 'Benefício 1\nBenefício 2'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const buildPayload = (): Partial<StoreItem> => {
    let isoUntil: string | null = null;
    if (isLimited && availableUntil) {
      const parsed = new Date(availableUntil);
      if (!Number.isNaN(parsed.getTime())) {
        isoUntil = parsed.toISOString();
      }
    }

    const fallbackGradient = `linear-gradient(90deg, ${gradientColor1}, ${gradientColor2})`;
    const resolvedAsset =
      category === 'nameplate'
        ? assetUrl && assetUrl.startsWith('linear-gradient')
          ? assetUrl
          : fallbackGradient
        : assetUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300';

    const resolvedPreview =
      category === 'nameplate'
        ? previewUrl && previewUrl.startsWith('linear-gradient')
          ? previewUrl
          : resolvedAsset
        : previewUrl || resolvedAsset;

    return {
      ...(initialItem ? { id: initialItem.id } : {}),
      title: title.trim() || 'Item sem título',
      description: description.trim(),
      category,
      rarity,
      priceBRL: Number(priceBRL) || 0,
      priceCoins: Number(priceCoins) || 0,
      assetUrl: resolvedAsset,
      previewUrl: resolvedPreview,
      isLimited,
      availableUntil: isoUntil,
      featured,
      isActive: initialItem ? initialItem.isActive : true,
      config: {
        animationType,
        gradientColors: [gradientColor1, gradientColor2],
        accentColor: gradientColor1,
        bannerColor,
        coinsAmount: Number(coinsAmount) || 0,
        coinsBonusPercent: Number(coinsBonusPercent) || 0,
        perksList: perksText.split('\n').map((s) => s.trim()).filter(Boolean),
      },
    };
  };

  const handleApplyPreview = () => {
    const currentItem = buildPayload();
    if (!title.trim()) {
      currentItem.title = 'Item em Criação';
    }
    onLivePreview?.(currentItem);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(buildPayload());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const showsVisualConfig =
    category === 'avatar_decoration' ||
    category === 'profile_effect' ||
    category === 'nameplate' ||
    category === 'profile_theme';

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
            type="button"
            onClick={onClose}
            className="text-[#949ba4] hover:text-white p-1 rounded-lg hover:bg-[#35373c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                  onChange={(e) => setPriceCoins(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#2b2d31] border border-[#383a40] rounded-lg pl-10 pr-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-[#5865f2]"
                />
              </div>
            </div>
          </div>

          {/* URLs de Assets & Preview Separadas */}
          {category !== 'nameplate' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#5865f2]" />
                  URL do Arquivo Principal (Asset)
                </label>
                <input
                  type="text"
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  placeholder="https://.../asset.webp ou apng ou mp4"
                  className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
                />
                <span className="text-[10px] text-[#949ba4] mt-0.5 block">
                  Arquivo animado principal (APNG, WebP, WebM ou Lottie).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  URL da Miniatura (Thumbnail / Preview)
                </label>
                <input
                  type="text"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="https://.../preview.png (opcional)"
                  className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
                />
                <span className="text-[10px] text-[#949ba4] mt-0.5 block">
                  Se deixar em branco, usará a URL do arquivo principal.
                </span>
              </div>
            </div>
          )}

          {/* Configurações Específicas por Categoria */}
          {showsVisualConfig && (
            <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5865f2]">
                Configurações Visuais & Efeitos
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {category === 'profile_theme' ? (
                  <div>
                    <label className="block text-[11px] text-[#949ba4] mb-1">Cor do Banner / Fundo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bannerColor}
                        onChange={(e) => setBannerColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bannerColor}
                        onChange={(e) => setBannerColor(e.target.value)}
                        className="flex-1 bg-[#2b2d31] border border-[#383a40] rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] text-[#949ba4] mb-1">Tipo de Animação</label>
                    <select
                      value={animationType}
                      onChange={(e) => setAnimationType(e.target.value as AnimationType)}
                      className="w-full bg-[#2b2d31] border border-[#383a40] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="glow">Brilho Neon (Glow)</option>
                      <option value="flame">Chamas Ardentes (Flame)</option>
                      <option value="wave">Efeito Ondulante (Wave)</option>
                      <option value="pulse">Pulso Elétrico (Lightning)</option>
                    </select>
                  </div>
                )}

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
                      className="flex-1 bg-[#2b2d31] border border-[#383a40] rounded px-2 py-1 text-xs text-white font-mono"
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
                      className="flex-1 bg-[#2b2d31] border border-[#383a40] rounded px-2 py-1 text-xs text-white font-mono"
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
                  onChange={(e) => setCoinsAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#2b2d31] border border-[#383a40] rounded px-3 py-1.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#949ba4] mb-1">% de Bônus Exibido</label>
                <input
                  type="number"
                  value={coinsBonusPercent}
                  onChange={(e) => setCoinsBonusPercent(parseInt(e.target.value, 10) || 0)}
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

          {/* Opções: Limitado & Destaque com Campo de Data de Expiração */}
          <div className="bg-[#1e1f22] p-4 rounded-xl border border-[#383a40] space-y-3">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#dbdee1]">
                <input
                  type="checkbox"
                  checked={isLimited}
                  onChange={(e) => setIsLimited(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#2b2d31] border-[#383a40] text-[#5865f2] focus:ring-0"
                />
                <span className="font-medium">Edição Limitada (Tempo limitado na loja)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#dbdee1]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#2b2d31] border-[#383a40] text-[#5865f2] focus:ring-0"
                />
                <span className="font-medium">Destaque na Loja (Banner Carrossel)</span>
              </label>
            </div>

            {/* Input de Data de Expiração Condicional */}
            {isLimited && (
              <div className="pt-2 border-t border-[#313338] animate-in fade-in duration-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Disponível na Loja Até (Data e Hora de Encerramento)
                </label>
                <input
                  type="datetime-local"
                  required={isLimited}
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className="w-full bg-[#2b2d31] border border-rose-500/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-[#949ba4] mt-1 block">
                  Após este horário, o item será desativado automaticamente do catálogo do PW.
                </span>
              </div>
            )}
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
              type="submit"
              form="product-form"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar & Sincronizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
