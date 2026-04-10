import { StateCreator } from 'zustand';
import { Song } from '../../types/tab';
import { fetchSong, persistSong } from '../helpers/persistence';
import { CursorSlice } from './cursorSlice';

export interface SongSlice {
  currentSong: Song | null;
  initSong: (song: Song) => void;
  loadSong: (id: string) => Promise<void>;
  saveSong: () => Promise<void>;
}

export const createSongSlice: StateCreator<SongSlice & CursorSlice, [], [], SongSlice> = (set, get) => ({
  currentSong: null,

  initSong: (song) => {
    set({
      currentSong: song,
      cursor: {
        sectionId: song.sections[0]?.id ?? '',
        step: 0,
        string: 5,
      },
    });
  },

  loadSong: async (id) => {
    const song = await fetchSong(id);
    if (!song) return;
    set({
      currentSong: song,
      cursor: { sectionId: song.sections[0]?.id ?? '', step: 0, string: 5 },
    });
  },

  saveSong: async () => {
    const { currentSong } = get();
    if (!currentSong) return;
    await persistSong(currentSong);
  },
});
