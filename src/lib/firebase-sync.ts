import { SyncPayload } from '@/types/store';

export interface FirebaseSyncConfig {
  firebaseWebhookUrl: string;
  syncSecret: string;
}

export async function dispatchSyncToPW(
  action: SyncPayload['action'],
  targetId: string,
  data: any
): Promise<{ success: boolean; message: string; payload: SyncPayload }> {
  const webhookUrl = process.env.FIREBASE_PW_WEBHOOK_URL || '';
  const syncSecret = process.env.PW_SYNC_SECRET || 'pw_secret_demo_token_2026';

  const payload: SyncPayload = {
    action,
    timestamp: new Date().toISOString(),
    targetId,
    data,
    secret: syncSecret,
  };

  if (!webhookUrl) {
    // Modo simulação se o webhook do Firebase ainda não estiver apontado
    console.log('[PW Sync Simulado] Enviando evento para o Firebase do PW:', payload);
    return {
      success: true,
      message: 'Sincronização simulada com sucesso! (Defina FIREBASE_PW_WEBHOOK_URL no .env)',
      payload,
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${syncSecret}`,
        'X-PW-Source': 'admin-panel',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Servidor Firebase respondeu com status ${res.status}: ${res.statusText}`);
    }

    const json = await res.json().catch(() => ({}));
    return {
      success: true,
      message: 'Notificação enviada ao servidor Firebase com sucesso!',
      payload,
    };
  } catch (error: any) {
    console.error('[PW Sync Erro]', error);
    return {
      success: false,
      message: `Falha ao conectar com o Firebase: ${error.message}`,
      payload,
    };
  }
}

