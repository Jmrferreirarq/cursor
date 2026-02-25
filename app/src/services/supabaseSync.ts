/**
 * Supabase cloud sync for app data.
 * Uses a single row in `app_data` table to store the full AppData JSON.
 * Falls back gracefully when Supabase is not configured.
 *
 * Table SQL (run once in Supabase SQL Editor):
 *
 *   create table app_data (
 *     id text primary key default 'default',
 *     data jsonb not null default '{}',
 *     updated_at timestamptz default now()
 *   );
 *
 *   alter table app_data enable row level security;
 *   create policy "Allow all" on app_data for all using (true) with check (true);
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppData } from './storage';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const ROW_ID = 'default';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (client) return client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

export function isCloudConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function cloudLoad(): Promise<AppData | null> {
  const sb = getClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('app_data')
      .select('data')
      .eq('id', ROW_ID)
      .single();
    if (error || !data) return null;
    return data.data as AppData;
  } catch {
    return null;
  }
}

export async function cloudSave(appData: AppData): Promise<boolean> {
  const sb = getClient();
  if (!sb) return false;
  try {
    const { error } = await sb
      .from('app_data')
      .upsert({ id: ROW_ID, data: appData, updated_at: new Date().toISOString() });
    return !error;
  } catch {
    return false;
  }
}
