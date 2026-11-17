import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  supabase,
  getAdminSupabase,
  isSupabaseConfigured,
  mapStoreItemFromDB,
  mapStoreItemToDB,
} from '@/lib/supabase';
import { dispatchSyncToPW } from '@/lib/firebase-sync';
import { INITIAL_ITEMS } from '@/lib/mock-data';
import { StoreItem } from '@/types/store';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = (id?: string): id is string => Boolean(id && UUID_REGEX.test(id));

// Memória local para fallback quando o Supabase não estiver configurado
let inMemoryProducts: StoreItem[] = [...INITIAL_ITEMS];

export async function GET() {
  const client = getAdminSupabase() || supabase;

  if (isSupabaseConfigured() && client) {
    try {
      const { data, error } = await client
        .from('store_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[API Products GET Erro Supabase]', error);
        return NextResponse.json({
          source: 'memory_fallback',
          items: inMemoryProducts,
          error: error.message,
        });
      }

      const mappedItems = (data || []).map(mapStoreItemFromDB);
      return NextResponse.json({
        source: 'supabase',
        items: mappedItems,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido';
      console.error('[API Products GET Exceção]', e);
      return NextResponse.json({
        source: 'memory_fallback',
        items: inMemoryProducts,
        error: message,
      });
    }
  }

  return NextResponse.json({
    source: 'memory',
    items: inMemoryProducts,
  });
}

export async function POST(req: Request) {
  try {
    const body: Partial<StoreItem> = await req.json();

    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, message: 'Título e categoria são obrigatórios.' },
        { status: 400 }
      );
    }

    const generatedId = isValidUuid(body.id) ? body.id : randomUUID();
    const now = new Date().toISOString();

    const newItem: StoreItem = {
      id: generatedId,
      title: body.title,
      description: body.description || '',
      category: body.category,
      rarity: body.rarity || 'common',
      priceBRL: Number(body.priceBRL ?? 0),
      priceCoins: Number(body.priceCoins ?? 0),
      assetUrl: body.assetUrl || '',
      previewUrl: body.previewUrl || body.assetUrl || '',
      badgeIconUrl: body.badgeIconUrl,
      config: body.config || {},
      isLimited: Boolean(body.isLimited),
      availableUntil: body.isLimited && body.availableUntil ? body.availableUntil : null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      featured: Boolean(body.featured),
      createdAt: now,
      updatedAt: now,
    };

    const client = getAdminSupabase() || supabase;
    if (isSupabaseConfigured() && client) {
      const dbRow = mapStoreItemToDB(newItem);
      const { data, error } = await client
        .from('store_items')
        .insert(dbRow)
        .select()
        .single();

      if (error) {
        console.error('[API Products POST Erro Supabase]', error);
        return NextResponse.json(
          { success: false, message: `Erro ao gravar no Supabase: ${error.message}` },
          { status: 500 }
        );
      }

      if (data) {
        Object.assign(newItem, mapStoreItemFromDB(data));
      }
    } else {
      inMemoryProducts = [newItem, ...inMemoryProducts.filter((i) => i.id !== newItem.id)];
    }

    const syncResult = await dispatchSyncToPW('ITEM_CREATED', newItem.id, newItem);

    return NextResponse.json({
      success: true,
      item: newItem,
      sync: syncResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno ao criar produto';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: Partial<StoreItem> = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'ID do produto é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    let updatedItem: Partial<StoreItem> = {
      ...body,
      updatedAt: now,
    };

    const client = getAdminSupabase() || supabase;
    if (isSupabaseConfigured() && client && isValidUuid(body.id)) {
      const dbRow = mapStoreItemToDB(updatedItem);
      delete dbRow.id;

      const { data, error } = await client
        .from('store_items')
        .update(dbRow)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        console.error('[API Products PUT Erro Supabase]', error);
        return NextResponse.json(
          { success: false, message: `Erro ao atualizar no Supabase: ${error.message}` },
          { status: 500 }
        );
      }

      if (data) {
        updatedItem = mapStoreItemFromDB(data);
      }
    } else {
      const existing = inMemoryProducts.find((i) => i.id === body.id);
      if (!existing) {
        return NextResponse.json(
          { success: false, message: 'Produto não encontrado.' },
          { status: 404 }
        );
      }
      const merged: StoreItem = { ...existing, ...updatedItem } as StoreItem;
      inMemoryProducts = inMemoryProducts.map((i) => (i.id === body.id ? merged : i));
      updatedItem = merged;
    }

    const syncResult = await dispatchSyncToPW('ITEM_UPDATED', body.id, updatedItem);

    return NextResponse.json({
      success: true,
      item: updatedItem,
      sync: syncResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno ao atualizar produto';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID do produto é obrigatório.' },
        { status: 400 }
      );
    }

    const client = getAdminSupabase() || supabase;
    if (isSupabaseConfigured() && client && isValidUuid(id)) {
      const { error } = await client
        .from('store_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[API Products DELETE Erro Supabase]', error);
        return NextResponse.json(
          { success: false, message: `Erro ao excluir no Supabase: ${error.message}` },
          { status: 500 }
        );
      }
    } else {
      inMemoryProducts = inMemoryProducts.filter((i) => i.id !== id);
    }

    const syncResult = await dispatchSyncToPW('ITEM_DELETED', id, null);

    return NextResponse.json({
      success: true,
      id,
      sync: syncResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno ao excluir produto';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
