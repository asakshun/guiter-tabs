import { StateCreator } from 'zustand';
import { SongSummary } from '../../types/tab';
import { fetchSongList, createSong, deleteSong } from '../helpers/persistence';

export interface SongListSlice {
  songs: SongSummary[];
  isLoadingSongList: boolean;
  fetchSongList: () => Promise<void>;
  createNewSong: (title: string) => Promise<string>;
  deleteSong: (id: string) => Promise<void>;
}

export const createSongListSlice: StateCreator<SongListSlice, [], [], SongListSlice> = (set) => ({
  songs: [],
  isLoadingSongList: false,

  fetchSongList: async () => {
    set({ isLoadingSongList: true });
    const songs = await fetchSongList();
    set({ songs, isLoadingSongList: false });
  },

  createNewSong: async (title) => {
    const song = await createSong(title);
    set((state) => ({
      songs: [
        { id: song.id, title: song.title, artist: song.artist, updatedAt: song.updatedAt },
        ...state.songs,
      ],
    }));
    return song.id;
  },

  deleteSong: async (id) => {
    if (id === 'mock') return;
    await deleteSong(id);
    set((state) => ({
      songs: state.songs.filter((s) => s.id !== id),
    }));
  },
});
