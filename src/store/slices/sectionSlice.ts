import { StateCreator } from 'zustand';
import { appendSection, deleteSection } from '../helpers/songMutators';
import { debouncedSave } from '../helpers/persistence';
import { SongSlice } from './songSlice';
import { CursorSlice } from './cursorSlice';

export interface SectionSlice {
  addSection: (label: string) => void;
  removeSection: (sectionId: string) => void;
  renameSection: (sectionId: string, label: string) => void;
}

export const createSectionSlice: StateCreator<SongSlice & CursorSlice & SectionSlice, [], [], SectionSlice> = (set, get) => ({
  addSection: (label) => {
    set((state) => {
      if (!state.currentSong) return state;
      const { sections, newSectionId } = appendSection(state.currentSong.sections, label);
      return {
        currentSong: { ...state.currentSong, sections },
        cursor: { sectionId: newSectionId, step: 0, string: state.cursor.string },
      };
    });
    debouncedSave(() => get().saveSong());
  },

  removeSection: (sectionId) => {
    set((state) => {
      if (!state.currentSong) return state;
      if (state.currentSong.sections.length <= 1) return state;
      const sections = deleteSection(state.currentSong.sections, sectionId);
      return {
        currentSong: { ...state.currentSong, sections },
        cursor: { sectionId: sections[0]?.id ?? '', step: 0, string: state.cursor.string },
      };
    });
    debouncedSave(() => get().saveSong());
  },

  renameSection: (sectionId, label) => {
    set((state) => {
      if (!state.currentSong) return state;
      const sections = state.currentSong.sections.map((s) =>
        s.id === sectionId ? { ...s, label } : s
      );
      return { currentSong: { ...state.currentSong, sections } };
    });
    debouncedSave(() => get().saveSong());
  },
});
