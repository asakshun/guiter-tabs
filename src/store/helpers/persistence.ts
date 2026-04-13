import { Song, SongSummary } from '../../types/tab';
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

/**
 * 曲一覧を取得（id, title, artist, updatedAt のみ）
 */
export async function fetchSongList(): Promise<SongSummary[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('id, title, artist, updated_at')
    .order('updated_at', { ascending: false });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    updatedAt: row.updated_at,
  }));
}

/**
 * 新曲を作成（デフォルトセクション「イントロ」1つ付き）
 */
export async function createSong(title: string): Promise<Song> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const defaultSection = {
    id: crypto.randomUUID(),
    index: 0,
    label: 'イントロ',
    steps: [],
  };
  const song: Song = {
    id,
    title,
    artist: '',
    tuning: 'EADGBe',
    createdAt: now,
    updatedAt: now,
    sections: [defaultSection],
  };
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('songs').insert({
    id: song.id,
    title: song.title,
    artist: song.artist,
    tuning: song.tuning,
    data: song.sections,
    updated_at: now,
    user_id: user?.id ?? null,
  });
  if (error) throw new Error(`曲の作成に失敗しました: ${error.message}`);
  return song;
}

/**
 * 曲を削除
 */
export async function deleteSong(id: string): Promise<void> {
  if (id === 'mock') return;
  await supabase.from('songs').delete().eq('id', id);
}
