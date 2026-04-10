import { Song } from '../../types/tab';
import { supabase } from '../../lib/supabase';

/**
 * 指定IDの曲を Supabase から取得して返す
 */
export async function fetchSong(id: string): Promise<Song | null> {
  const { data, error } = await supabase.from('songs').select('*').eq('id', id).single();
  if (error || !data) return null;
  return { ...data, sections: data.data };
}

/**
 * 曲を Supabase に upsert する
 */
export async function persistSong(song: Song): Promise<void> {
  if (song.id === 'mock') return;
  await supabase.from('songs').upsert({
    id: song.id,
    title: song.title,
    artist: song.artist,
    tuning: song.tuning,
    data: song.sections,
    updated_at: new Date().toISOString(),
  });
}

/**
 * 各アクション末尾で呼ぶ遅延保存
 * setTimeout(() => saveSong(), 500) を一元化
 */
export function debouncedSave(saveFn: () => Promise<void>): void {
  setTimeout(saveFn, 500);
}
