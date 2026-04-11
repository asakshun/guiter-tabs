/**
 * songListSlice のユニットテスト
 *
 * 実行方法:
 *   pnpm add -D vitest @vitest/ui happy-dom
 *   package.json の scripts に "test": "vitest" を追加
 *   pnpm test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'zustand/vanilla';
import { createSongListSlice, SongListSlice } from './songListSlice';

// persistence モジュールをモック
vi.mock('../helpers/persistence', () => ({
  fetchSongList: vi.fn(),
  createSong: vi.fn(),
  deleteSong: vi.fn(),
}));

import * as persistence from '../helpers/persistence';

function makeStore() {
  return createStore<SongListSlice>()((...args) => ({
    ...createSongListSlice(...args),
  }));
}

describe('songListSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態は songs が空配列で isLoadingSongList が false', () => {
    const store = makeStore();
    const state = store.getState();
    expect(state.songs).toEqual([]);
    expect(state.isLoadingSongList).toBe(false);
  });

  describe('fetchSongList', () => {
    it('取得成功時に songs がセットされる', async () => {
      const mockSongs = [
        { id: '1', title: 'テスト曲', artist: 'アーティスト', updatedAt: '2026-01-01T00:00:00Z' },
      ];
      vi.mocked(persistence.fetchSongList).mockResolvedValue(mockSongs);

      const store = makeStore();
      await store.getState().fetchSongList();

      expect(store.getState().songs).toEqual(mockSongs);
      expect(store.getState().isLoadingSongList).toBe(false);
    });

    it('ローディング中は isLoadingSongList が true になる', async () => {
      let resolvePromise!: (value: typeof persistence.fetchSongList extends () => Promise<infer T> ? T : never) => void;
      const promise = new Promise<Awaited<ReturnType<typeof persistence.fetchSongList>>>((resolve) => {
        resolvePromise = resolve;
      });
      vi.mocked(persistence.fetchSongList).mockReturnValue(promise);

      const store = makeStore();
      const fetchPromise = store.getState().fetchSongList();

      expect(store.getState().isLoadingSongList).toBe(true);

      resolvePromise([]);
      await fetchPromise;

      expect(store.getState().isLoadingSongList).toBe(false);
    });
  });

  describe('createNewSong', () => {
    it('作成した曲が songs の先頭に追加され、IDが返る', async () => {
      const mockSong = {
        id: 'new-id',
        title: '新曲',
        artist: '',
        tuning: 'EADGBe',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        sections: [],
      };
      vi.mocked(persistence.createSong).mockResolvedValue(mockSong);

      const store = makeStore();
      const id = await store.getState().createNewSong('新曲');

      expect(id).toBe('new-id');
      expect(store.getState().songs[0]).toMatchObject({
        id: 'new-id',
        title: '新曲',
        artist: '',
      });
    });
  });

  describe('deleteSong', () => {
    it('指定IDの曲が songs から除外される', async () => {
      vi.mocked(persistence.fetchSongList).mockResolvedValue([
        { id: '1', title: '曲A', artist: '', updatedAt: '' },
        { id: '2', title: '曲B', artist: '', updatedAt: '' },
      ]);
      vi.mocked(persistence.deleteSong).mockResolvedValue();

      const store = makeStore();
      await store.getState().fetchSongList();
      await store.getState().deleteSong('1');

      const songs = store.getState().songs;
      expect(songs).toHaveLength(1);
      expect(songs[0].id).toBe('2');
    });

    it('id が "mock" の場合は削除されない', async () => {
      vi.mocked(persistence.fetchSongList).mockResolvedValue([
        { id: 'mock', title: 'モック曲', artist: '', updatedAt: '' },
      ]);

      const store = makeStore();
      await store.getState().fetchSongList();
      await store.getState().deleteSong('mock');

      expect(persistence.deleteSong).not.toHaveBeenCalled();
      expect(store.getState().songs).toHaveLength(1);
    });
  });
});
