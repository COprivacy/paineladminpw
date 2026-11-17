'use client';

import React, { useState } from 'react';
import { PWUserProfile, StoreItem } from '@/types/store';
import { X, Gift, Coins, Check, AlertCircle } from 'lucide-react';

interface GrantItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: PWUserProfile[];
  items: StoreItem[];
  onGrantItem: (userId: string, itemId: string) => void;
  onGrantCoins: (userId: string, amount: number) => void;
}

export const GrantItemModal: React.FC<GrantItemModalProps> = ({
  isOpen,
  onClose,
  users,
  items,
  onGrantItem,
  onGrantCoins,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [grantType, setGrantType] = useState<'item' | 'coins'>('item');
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [coinsAmount, setCoinsAmount] = useState<number>(500);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    if (grantType === 'item') {
      onGrantItem(selectedUserId, selectedItemId);
      setSuccessMsg('Cosmético concedido ao usuário e sincronizado com o PW!');
    } else {
      onGrantCoins(selectedUserId, coinsAmount);
      setSuccessMsg(`${coinsAmount} PW Coins adicionadas ao saldo do usuário!`);
    }

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#2b2d31] w-full max-w-md rounded-2xl shadow-2xl border border-[#383a40] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-[#232428] border-b border-[#1f2023] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#23a55a]/20 text-[#23a55a]">
              <Gift className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-[#f2f3f5]">Conceder Item ou Moedas</h2>
          </div>
          <button onClick={onClose} className="text-[#949ba4] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGrant} className="p-6 space-y-4">
          {successMsg ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-sm">
              <Check className="w-5 h-5" />
              <span>{successMsg}</span>
            </div>
          ) : (
            <>
              {/* Usuário Alvo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                  Usuário do PW
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username}#{u.discriminator} ({u.coinsBalance} coins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Concessão */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                  O que você deseja conceder?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGrantType('item')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      grantType === 'item'
                        ? 'bg-[#5865f2] border-[#5865f2] text-white'
                        : 'bg-[#1e1f22] border-[#383a40] text-[#949ba4] hover:text-[#dbdee1]'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    Cosmético da Loja
                  </button>

                  <button
                    type="button"
                    onClick={() => setGrantType('coins')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      grantType === 'coins'
                        ? 'bg-[#f0b232] border-[#f0b232] text-black'
                        : 'bg-[#1e1f22] border-[#383a40] text-[#949ba4] hover:text-[#dbdee1]'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    PW Coins
                  </button>
                </div>
              </div>

              {/* Seleção de Item ou Valor */}
              {grantType === 'item' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                    Escolha o Cosmético
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-[#dbdee1] focus:outline-none focus:border-[#5865f2]"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        [{i.category.toUpperCase()}] {i.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#949ba4] mb-1.5">
                    Quantidade de Coins a Adicionar
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={coinsAmount}
                    onChange={(e) => setCoinsAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1e1f22] border border-[#383a40] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f0b232]"
                  />
                </div>
              )}

              <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#313338] text-xs text-[#949ba4] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#5865f2] shrink-0 mt-0.5" />
                <span>
                  O item será inserido na tabela <code>user_inventory</code> do Supabase e o webhook do Firebase será disparado para atualizar o cliente do usuário em tempo real.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs text-[#949ba4] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#23a55a] hover:bg-[#1d8246] text-white font-semibold text-xs shadow-md"
                >
                  Confirmar Entrega
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
