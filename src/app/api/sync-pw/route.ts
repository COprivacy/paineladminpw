import { NextResponse } from 'next/server';
import { dispatchSyncToPW } from '@/lib/firebase-sync';
import { supabase, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';

export async function GET() {
  const supabaseReady = isSupabaseConfigured();
  let supabaseCount = 0;
  let supabaseError: string | null = null;

  const client = getAdminSupabase() || supabase;
  if (supabaseReady && client) {
    try {
      const { count, error } = await client
        .from('store_items')
        .select('*', { count: 'exact', head: true });
      if (error) {
        supabaseError = error.message;
      } else {
        supabaseCount = count || 0;
      }
    } catch (e: unknown) {
      supabaseError = e instanceof Error ? e.message : 'Erro ao consultar Supabase';
    }
  }

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    services: {
      supabase: {
        configured: supabaseReady,
        itemCount: supabaseCount,
        error: supabaseError,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Não configurado (Usando Mock)',
      },
      firebase: {
        configured: Boolean(process.env.FIREBASE_PW_WEBHOOK_URL),
        webhookUrl: process.env.FIREBASE_PW_WEBHOOK_URL || 'Simulado em memória',
      },
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, targetId, data } = body;

    const result = await dispatchSyncToPW(
      action || 'ITEM_UPDATED',
      targetId || 'test-target-id',
      data || { message: 'Teste de sincronização Painel Admin -> PW' }
    );

    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar requisição';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
