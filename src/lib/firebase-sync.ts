import { SyncPayload } from '@/types/store';

export interface FirebaseSyncConfig {
  firebaseWebhookUrl: string;
  syncSecret: string;
}

export async function dispatchSyncToPW(
  action: SyncPayload['action'],
  targetId: string,
  data: unknown
): Promise<{ success: boolean; message: string; payload: Omit<SyncPayload, 'secret'> }> {
  const webhookUrl = process.env.FIREBASE_PW_WEBHOOK_URL || '';
  const syncSecret = process.env.PW_SYNC_SECRET || '';

  const publicPayload: Omit<SyncPayload, 'secret'> = {
    action,
    timestamp: new Date().toISOString(),
    targetId,
    data,
  };

  if (!webhookUrl) {
    // Modo simulação se o webhook do Firebase ainda não estiver apontado
    console.log('[PW Sync Simulado] Evento preparado para o Firebase do PW:', publicPayload);
    return {
      success: true,
      message: 'Sincronização simulada com sucesso! (Defina FIREBASE_PW_WEBHOOK_URL no .env.local)',
      payload: publicPayload,
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-PW-Source': 'admin-panel',
    };
    if (syncSecret) {
      headers['Authorization'] = `Bearer ${syncSecret}`;
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...publicPayload,
        ...(syncSecret ? { secret: syncSecret } : {}),
      }),
    });

    if (!res.ok) {
      throw new Error(`Servidor Firebase respondeu com status ${res.status}: ${res.statusText}`);
    }

    return {
      success: true,
      message: 'Notificação enviada ao servidor Firebase com sucesso!',
      payload: publicPayload,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[PW Sync Erro]', error);
    return {
      success: false,
      message: `Falha ao conectar com o Firebase: ${message}`,
      payload: publicPayload,
    };
  }
}
