import { NextResponse } from 'next/server';
import { getAdminSupabase, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { dispatchSyncToPW } from '@/lib/firebase-sync';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = (id?: string): id is string => Boolean(id && UUID_REGEX.test(id));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, grantType, itemId, coinsAmount } = body;

    if (!userId || !grantType) {
      return NextResponse.json(
        { success: false, message: 'userId e grantType são obrigatórios.' },
        { status: 400 }
      );
    }

    const client = getAdminSupabase() || supabase;

    if (grantType === 'item') {
      if (!itemId) {
        return NextResponse.json(
          { success: false, message: 'itemId é obrigatório para conceder cosmético.' },
          { status: 400 }
        );
      }

      if (isSupabaseConfigured() && client && isValidUuid(userId) && isValidUuid(itemId)) {
        const { error: invError } = await client
          .from('user_inventory')
          .upsert(
            {
              user_id: userId,
              item_id: itemId,
              source: 'admin',
            },
            { onConflict: 'user_id,item_id' }
          );

        if (invError) {
          return NextResponse.json(
            { success: false, message: `Erro ao inserir em user_inventory: ${invError.message}` },
            { status: 500 }
          );
        }

        await client.from('store_orders').insert({
          user_id: userId,
          item_id: itemId,
          amount_brl: 0,
          amount_coins: 0,
          payment_method: 'admin_grant',
          status: 'completed',
        });
      }

      const syncResult = await dispatchSyncToPW('INVENTORY_GRANTED', userId, {
        grantType: 'item',
        itemId,
      });

      return NextResponse.json({
        success: true,
        sync: syncResult,
      });
    }

    if (grantType === 'coins') {
      const amount = Number(coinsAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { success: false, message: 'Quantidade de coins deve ser maior que zero.' },
          { status: 400 }
        );
      }

      if (isSupabaseConfigured() && client && isValidUuid(userId)) {
        const { data: userRow, error: fetchError } = await client
          .from('user_profiles')
          .select('coins_balance')
          .eq('id', userId)
          .single();

        if (fetchError) {
          return NextResponse.json(
            { success: false, message: `Usuário não encontrado no Supabase: ${fetchError.message}` },
            { status: 404 }
          );
        }

        const newBalance = (userRow?.coins_balance || 0) + amount;
        const { error: updateError } = await client
          .from('user_profiles')
          .update({ coins_balance: newBalance })
          .eq('id', userId);

        if (updateError) {
          return NextResponse.json(
            { success: false, message: `Erro ao atualizar coins_balance: ${updateError.message}` },
            { status: 500 }
          );
        }
      }

      const syncResult = await dispatchSyncToPW('INVENTORY_GRANTED', userId, {
        grantType: 'coins',
        coinsAmount: amount,
      });

      return NextResponse.json({
        success: true,
        sync: syncResult,
      });
    }

    return NextResponse.json(
      { success: false, message: 'grantType inválido.' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno ao conceder item/coins';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

