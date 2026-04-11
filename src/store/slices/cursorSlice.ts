import { StateCreator } from 'zustand';
import { StringNumber } from '../../types/tab';

export interface Cursor {
  sectionId: string;
  step: number;
  string: StringNumber;
}

export interface CursorSlice {
  cursor: Cursor;
  setCursor: (cursor: Partial<Cursor>) => void;
}

export const createCursorSlice: StateCreator<CursorSlice> = (set) => ({
  cursor: { sectionId: '', step: 0, string: 5 },

  setCursor: (partial) => {
    set((state) => ({ cursor: { ...state.cursor, ...partial } }));
  },
});
