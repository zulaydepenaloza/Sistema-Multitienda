import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project configuration for this setup
// Users can override these dynamically in the UI settings
export const DEFAULT_SUPABASE_URL = 'https://jfnpxkxnkriquvapzniy.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = '';

const STORAGE_KEY_URL = 'pos_supabase_url';
const STORAGE_KEY_ANON = 'pos_supabase_anon_key';
const STORAGE_KEY_SYNC_QUEUE = 'pos_supabase_sync_queue';

export interface SyncQueueItem {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'upsert' | 'delete';
  payload: any;
  timestamp: string;
}

export function getStoredSupabaseConfig() {
  const url = localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_SUPABASE_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_ANON) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
}

export function createCustomSupabaseClient(url: string, anonKey: string): SupabaseClient | null {
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  } catch (e) {
    console.error('Error creating Supabase client:', e);
    return null;
  }
}

export function getSyncQueue(): SyncQueueItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading sync queue:', e);
  }
  return [];
}

export function addToSyncQueue(table: string, action: SyncQueueItem['action'], payload: any) {
  try {
    const queue = getSyncQueue();
    const item: SyncQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table,
      action,
      payload,
      timestamp: new Date().toISOString(),
    };
    queue.push(item);
    localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(queue));
    return item;
  } catch (e) {
    console.error('Error adding to sync queue:', e);
  }
}

export function clearSyncQueue() {
  try {
    localStorage.removeItem(STORAGE_KEY_SYNC_QUEUE);
  } catch (e) {}
}

export async function processSyncQueue(client: SupabaseClient): Promise<{ success: number; failed: number }> {
  const queue = getSyncQueue();
  if (queue.length === 0) return { success: 0, failed: 0 };

  const remaining: SyncQueueItem[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const item of queue) {
    try {
      let error = null;
      if (item.action === 'insert') {
        const res = await client.from(item.table).insert(item.payload);
        error = res.error;
      } else if (item.action === 'upsert') {
        const res = await client.from(item.table).upsert(item.payload);
        error = res.error;
      } else if (item.action === 'update' && item.payload.id) {
        const res = await client.from(item.table).update(item.payload).eq('id', item.payload.id);
        error = res.error;
      } else if (item.action === 'delete' && item.payload.id) {
        const res = await client.from(item.table).delete().eq('id', item.payload.id);
        error = res.error;
      }

      if (error) {
        console.warn(`Sync queue error on table ${item.table}:`, error);
        remaining.push(item);
        failCount++;
      } else {
        successCount++;
      }
    } catch (e) {
      console.warn(`Sync queue exception on table ${item.table}:`, e);
      remaining.push(item);
      failCount++;
    }
  }

  localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(remaining));
  return { success: successCount, failed: failCount };
}

