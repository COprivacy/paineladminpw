import { NextResponse } from 'next/server';
import { dispatchSyncToPW } from '@/lib/firebase-sync';
import { supabase, isSupabaseConfigured, getAdminSupabase } from '@/lib/supabase';

export async function GET() {
  const supabaseReady = isSupabaseConfigured();
  let supabaseCount = 0;
  let supabaseError = null;

  if (supabaseReady && supabase) {
    try {
      const { count, error } = await supabase
        .from('store_items')
        .select('*', { count: 'exact', head: true });
      if (error) {
        supabaseError = error.message;
      } else {
        supabaseCount = count || 0;
      }
    } catch (e: any) {
      supabaseError = e.message;
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

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

